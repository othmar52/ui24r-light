let appData = {
    // client config
    ip: '10.0.1.124',
    subscriptions: [],
    linkedSubscriptions: {},
    backgroundSubscriptions: [],

    me: {
        inputs: [6, 20, 9],
        aux: [2]
    },

    // singletons
    sock: null,
    parser: null,

    // mixer constants
    zeroDbPos: .7647058823529421,
    curSetup: {
        input: 24,
        linein: 2,
        fx: 4,
        aux: 10,
        sub: 6,
        rec: true,
        // TODO: below variables can be removed, right?
        bankSize: 8,
        maxx: false,
        phantom: 20,
        uniqueid: '8100C00220460094148085785103303C'
    },

    // realtime mixer values
    vu: {}, // realtime levels of audio signals
    mData: {} // fader values, button states, etc.
};

let app = (() => {

    log = function (data) {
        console.log(data);
    }

    init = function () {

        this.createGuiConfig();
        appData.parser = new Parser();

        let uniqueSuffix = (new Date).getTime() + (new Date).getMilliseconds();
        appData.sock = new WebSocket(`ws://${appData.ip}/socket.io/1/websocket/${uniqueSuffix}`);
        let that = this;
        appData.sock.onopen = function (event) {
            that.log('open');
            that.sendMessage('USERTIME^' + Date.now() + '^' + (new Date).getTimezoneOffset());

            setInterval(function () {
                that.sendMessage('ALIVE')
            }, 1E3);
        }

        appData.sock.onclose = function (event) {
            that.log('close');
        }
        appData.sock.onmessage = function (event) {
            that.receiveMessages(event.data);
        }
        appData.sock.onerror = function (event) {
            that.log('error');
        }
    }

    createGuiConfig = function () {
        // currently config is read from hash
        this.fetchSubscriptionsFromUrl();

        if(appData.subscriptions.length === 0) {
            this.fetchSubscriptionsFromMyConfig();
        }
        // TODO create config screen
    }

    fetchSubscriptionsFromUrl = function () {
        let subs = document.location.hash.substring(1).split('/');
        if (subs.length === 1 && subs[0] === '') {
            this.log('missing info which slider should be created...');
            return;
        }
        for (let fullkey of subs) {
            let keys = fullkey.split('+');
            appData.subscriptions.push(keys[0]);
            switch (keys.length) {
                case 1:
                    // single channel (mono)
                    this.createSlider(keys[0]);
                    break;
                case 2:
                    // dual channel (stereo)
                    this.createSlider(keys[0], keys[1]);
                    appData.linkedSubscriptions[keys[0]] = keys[1];
                    break;
            }
        }
    }

    // configuration where 'my' input channels and 'my' aux(headphone mix) is defined
    fetchSubscriptionsFromMyConfig = function () {
        let keysHeadphoneMix = [];
        let keysMasterMix = [];

        // very first fader is the level for the headphones
        // TODO: add possible linked stereo AUX channel
        this.createSlider(`a.${appData.me.aux[0]}.mix`, null, 'hplevel');
        appData.subscriptions.push(`a.${appData.me.aux[0]}.mix`);

        this.createSlider('group', null, 'group');

        // create sliders for 'my' channels
        appData.me.inputs.forEach(function (index) {
            // TODO: handle stereoLinks
            console.log(index);
            keysHeadphoneMix.push(`i.${index}.aux.${appData.me.aux[0]}.value`);
            keysMasterMix.push(`i.${index}.mix`);
        });

        // handle those separately to have grouped ordering of GUI-sliders
        keysHeadphoneMix.forEach(function (key) {
            appData.subscriptions.push(key);
            this.createSlider(key, null, 'headphonemix');
        });

        keysMasterMix.forEach(function (key) {
            appData.subscriptions.push(key);
            this.createSlider(key, null, 'mastermix');
        });


        // create backgroundSubscriptions
        // TODO also subscribe the mute state of others to reflect in the personal mix
        [...Array(appData.curSetup.input).keys()].forEach(function (index) {
            if (appData.me.inputs.includes(index)) {
                // skip 'my' inputs for this aux. for those we have our own GUI faders
                return;
            }
            appData.backgroundSubscriptions.push(`i.${index}.mix`);
        });
    }

    createSlider = function (key, key2 = null, addClass = '') {

        let sliderMarkup = `
            <div class='range-slider__vu-left-in'>
                <div class='vubar'></div>
            </div>
            <div class='range-slider__vu-left-out'>
                <div class='vubar'></div>
            </div>
            <div class='range-slider__vu-right-in'>
                <div class='vubar'></div>
            </div>
            <div class='range-slider__vu-right-out'>
                <div class='vubar'></div>
            </div>
            <div class='range-slider__bar'></div>
            <div class='range-slider__thumb'></div>
        `;

        /*
        let slider = document.createElement(
            'div',
            {
                'class': 'range-slider',
                'data-key': key,
                'data-key2': key2,
                'data-slider-db': ''
            }
        );
        */
        let slider = document.createElement('div');
        slider.setAttribute('class', `range-slider ${addClass}`);
        slider.setAttribute('data-key', key);
        slider.setAttribute('data-key2', key2);
        slider.setAttribute('data-slider-db', '');

        let sliderInput = document.createElement('input');
        sliderInput.setAttribute('type', 'range');
        sliderInput.setAttribute('orient', 'vertical');
        sliderInput.setAttribute('min', '0');
        sliderInput.setAttribute('max', '100');
        sliderInput.setAttribute('value', appData.zeroDbPos * 100);

        slider.append(sliderInput);

        appendStringAsNodes(slider, sliderMarkup);
        
        let sliderLabel = document.createElement('div');
        sliderLabel.setAttribute('class', 'range-slider__label');
        //console.log(appData.mData['i.0.name']);
        sliderLabel.textContent = key;
        slider.append(sliderLabel);

        document.querySelector('.slider-container').append(slider);

        // Cross-browser support where value changes instantly as you drag the handle, therefore two event types.
        sliderInput.addEventListener('input', () => app.updateSlider(sliderInput));
        sliderInput.addEventListener('change', () => app.updateSlider(sliderInput));
        this.updateSlider(sliderInput);
    }

    sendMessage = function (msg) {
        return null != appData.sock && appData.sock.readyState === appData.sock.OPEN
            ? (appData.sock.send(`3:::${msg}`), true)
            : false;
    }

    receiveMessages = function (data) {
        data = data.split(/\n/);
        data.forEach(lineData => (
            this.receiveMessage(lineData)
        ));
    }

    receiveMessage = function (data) {
        if (!data) { return; }

        if (data.startsWith('SETD^')) {
            var b = data.split('^', 3);
            3 > b.length || putValue(b[1], parseFloat(b[2]))
        } else data.startsWith('SETS^')
            ? (b = data.split('^', 3), 3 > b.length || this.putValue(b[1], b[2]))
            : appData.parser.parseCommand(data)
    }

    putValue = function (key, value) {

        if (appData.mData[key] === value) {
            return;
        }
        appData.mData[key] = value;
        this.applyBackgroundSubscriptions(key, value);
        if (appData.subscriptions.includes(key) === false) {
            return;
        }
        //this.log('subscription for ' + key);
        this.updateGuiElement(key, value);
    }

    setMixerValue = function (key, value) {

        if (key === 'group') {
            return this.applyGroupVolume(value);
        }

        if (key === 'null' || appData.mData[key] === value) {
            return;
        }

        this.putValue(key, value);
        this.log(`[${key}] ${value}`);
        this.sendMessage(`SET${('string' == typeof value ? 'S' : 'D')}^${key}^${value}`);
    }

    applyGroupVolume = function (groupFaderValue) {
        // 0.7647058823529421 (zeroDb) has to be exactly 1 as factor
        // so below zeroDb it must be negative and above it has to be positive to a maximum of 1.307692307692306
        let factor = groupFaderValue / (appData.zeroDbPos / 100) / 100;
        [...Array(appData.curSetup.input).keys()].forEach(function (index) {
            if (appData.me.inputs.includes(index)) {
                // skip 'my' inputs
                return;
            }
            // read actual value of others inputs beeing sent to master and apply the factor to 'my' aux mix
            let otherInput2MasterLevel = appData.mData[`i.${index}.mix`];
            let auxLevelForMyMix = otherInput2MasterLevel * factor;
            (auxLevelForMyMix > 1) && (auxLevelForMyMix = 1);
            this.sendMessage(
                `SETD^i.${index}.aux.${appData.me.aux[0]}.value^${auxLevelForMyMix}`
            );

        });
    }

    // in case input->master of 'non-my'-channels changes we have to reflect the level change in 'my' aux mix
    applyBackgroundSubscriptions = function (key, value) {
        if (!appData.backgroundSubscriptions.includes(key)) {
            return;
        };
        let groupFaderValue = document.querySelector('[data-key="group"] input').value / 100;
        let factor = groupFaderValue / (appData.zeroDbPos / 100) / 100;
        let inputIndex = parseInt(key.replace(/\D/g, ''));
        let otherInput2MasterLevel = value;
        let auxLevelForMyMix = otherInput2MasterLevel * factor;
        (auxLevelForMyMix > 1) && (auxLevelForMyMix = 1);
        this.sendMessage(
            `SETD^i.${inputIndex}.aux.${appData.me.aux[0]}.value^${auxLevelForMyMix}`
        );

        /*
        console.log(
            'background ',
            'key', key,
            'inputIndex', inputIndex,
            'groupFaderValue', groupFaderValue,
            'factor', factor,
            'otherInput2MasterLevel', otherInput2MasterLevel,
            'auxLevelForMyMix', auxLevelForMyMix
        );
        */
    }

    updateSlider = function (element, isRemoteChange = false) {
        if (!element) {
            this.log('no element');
            return;
        }
        let parent = element.parentElement,
            lastValue = parent.getAttribute('data-slider-value');

        var val = element.value;
        if (lastValue === val) {
            this.log('val unchanged');
            return; // No value change, no need to update then
        }

        parent.setAttribute('data-slider-db', (val / 100));

        if (isRemoteChange !== true) {
            this.setMixerValue(parent.getAttribute('data-key'), val / 100);
            if (parent.getAttribute('data-key2')) {
                this.setMixerValue(parent.getAttribute('data-key2'), val / 100);
            }
        }


        parent.setAttribute('data-slider-value', val);
        let $thumb = parent.querySelector('.range-slider__thumb'),
            $bar = parent.querySelector('.range-slider__bar'),
            pct = val * ((parent.clientHeight - $thumb.clientHeight) / parent.clientHeight);

        $thumb.style.bottom = `${pct}%`;
        $bar.style.height = `calc(${pct}% + ${$thumb.clientHeight / 2}px)`;
        $thumb.textContent = '';
    }

    updateGuiElement = function (key, value) {
        let el = document.querySelector(`[data-key="${key}"] input`);
        if (el === null) {
            this.log(`TODO: handle element with key ${key} does not exist`);
            return;
        }
        el.value = (Math.floor(value * 100)).toString();
        this.updateSlider(el, true);
    }

    appendStringAsNodes = function (element, html) {
        let frag = document.createDocumentFragment(),
            tmp = document.createElement('body'),
            child;
        tmp.innerHTML = html;
        // Append elements in a loop to a DocumentFragment, so that the browser does
        // not re-render the document for each node
        while (child = tmp.firstChild) {
            frag.appendChild(child);
        }
        element.appendChild(frag); // Now, append all elements at once
        frag = tmp = null;
    }


    updateVuStrips = function () {
        appData.subscriptions.forEach(key => (
            (typeof appData.vu[key] !== 'undefined') && (
                document.querySelector(`[data-key="${key}"] .range-slider__vu-left-in .vubar`).style.height = this.vuHeight(appData.vu[key].pre),
                document.querySelector(`[data-key="${key}"] .range-slider__vu-left-out .vubar`).style.height = this.vuHeight(appData.vu[key].post),
                (appData.linkedSubscriptions[key]) && (
                    // right channel vu meter
                    document.querySelector(`[data-key2="${appData.linkedSubscriptions[key]}"] .range-slider__vu-right-in .vubar`).style.height = this.vuHeight(appData.vu[appData.linkedSubscriptions[key]].pre),
                    document.querySelector(`[data-key2="${appData.linkedSubscriptions[key]}"] .range-slider__vu-right-out .vubar`).style.height = this.vuHeight(appData.vu[appData.linkedSubscriptions[key]].post)
                ) || (
                    // visually clone single channel to right vu meter
                    document.querySelector(`[data-key="${key}"] .range-slider__vu-right-in .vubar`).style.height = this.vuHeight(appData.vu[key].pre),
                    document.querySelector(`[data-key="${key}"] .range-slider__vu-right-out .vubar`).style.height = this.vuHeight(appData.vu[key].post)
                )
            ),
            // master is treated special
            (key === 'm.mix') && (
                document.querySelector(`[data-key="${key}"] .range-slider__vu-left-in .vubar`).style.height = this.vuHeight(appData.vu['m.0.mix'].pre),
                document.querySelector(`[data-key="${key}"] .range-slider__vu-left-out .vubar`).style.height = this.vuHeight(appData.vu['m.0.mix'].post),
                document.querySelector(`[data-key="${key}"] .range-slider__vu-right-in .vubar`).style.height = this.vuHeight(appData.vu['m.1.mix'].pre),
                document.querySelector(`[data-key="${key}"] .range-slider__vu-right-out .vubar`).style.height = this.vuHeight(appData.vu['m.1.mix'].post)
            )
        ));
    }

    vuHeight = function (val) {
        val > 1 && (val = 1);
        return val * 100 + '%';

    }

    return {
        updateSlider: updateSlider,
        createSlider: createSlider,
        sendMessage: sendMessage,
        receiveMessages: receiveMessages,
        receiveMessage: receiveMessage,
        init: init,
        createGuiConfig: createGuiConfig,
        fetchSubscriptionsFromUrl: fetchSubscriptionsFromUrl,
        fetchSubscriptionsFromMyConfig: fetchSubscriptionsFromMyConfig,
        appendStringAsNodes: appendStringAsNodes,
        applyGroupVolume: applyGroupVolume,
        putValue: putValue,
        setMixerValue: setMixerValue,
        updateGuiElement: updateGuiElement,
        applyBackgroundSubscriptions: applyBackgroundSubscriptions,
        updateVuStrips: updateVuStrips,
        vuHeight: vuHeight,
        log: log
    };

})();

app.init();