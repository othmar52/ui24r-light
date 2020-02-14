class Parser {
    parseCommand(msg) {
        switch (true) {
            case msg.startsWith("VU2^"):
                return this.parseVUdata(msg);

            case msg.startsWith("INIT^"):
                Object.extend(
                    appData.mData,
                    JSON.parse(msg.substring(5))
                );
                return;

            case msg.startsWith("VUA^"):
            case msg.startsWith("RTA^"):
            case msg.startsWith("BMSG^"):
            case msg.startsWith("INIT^"):
            case msg.startsWith("MSG^"):
            case msg.startsWith("DLGSHOW^"):
            case msg.startsWith("DLGHIDE^"):
            case msg.startsWith("SHOWLIST^"):
            case msg.startsWith("SNAPSHOTLIST^"):
            case msg.startsWith("CUELIST^"):
            case msg.startsWith("PRESETLIST^"):
            case msg.startsWith("USBMOUNTS^"):
            case msg.startsWith("IMPORTSHOWLIST^"):
            case msg.startsWith("READPRESET^"):
            case msg.startsWith("PLISTS^"):
            case msg.startsWith("PLIST_TRACKS^"):
            case msg.startsWith("MTK_GET_SESSIONS^"):
            case msg.startsWith("MTK_GET_FILES^"):
            case msg.startsWith("TIMEDIALOG^"):
            case (msg === "RELOAD"):
            case msg.startsWith("SERIAL"):
                // not implemented yet
                return;
        }
    }

    parseVUdata(a) {
        // TODO: skip by configuration
        //if (settings.disableVUs || settings.disableVUs2) {
        //    return;
        //}
        a = atob(a.slice(4));

        for (var b = false, c = false, e = 8, g = 0, h = a.charCodeAt(0); g < h && !(g >= appData.curSetup.input); g++) {
            var l = e + 6 * g,
                m = this.deconvertVU(a.charCodeAt(l + 0)),
                n = this.deconvertVU(a.charCodeAt(l + 1)),
                q = this.deconvertVU(a.charCodeAt(l + 2)),
                r = this.deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1),
                p = 0 != (a.charCodeAt(l + 5) & 128);
            appData.vu["i." + g + ".mix"] = { pre: n, post: q };
        }
        l = e += 6 * a.charCodeAt(0);
        n = this.deconvertVU(a.charCodeAt(l + 1));
        q = this.deconvertVU(a.charCodeAt(l + 2));
        r = this.deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1);
        p = 0 != (a.charCodeAt(l + 5) & 128);


        l = e + 6;
        n = this.deconvertVU(a.charCodeAt(l + 1));
        q = this.deconvertVU(a.charCodeAt(l + 2));
        r = this.deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1);
        p = 0 != (a.charCodeAt(l + 5) & 128);

        e += 6 * a.charCodeAt(1);
        for (g = 0; g < a.charCodeAt(2) && !(g >= appData.curSetup.sub); g++)
            l = e + 7 * g,
                n = this.deconvertVU(a.charCodeAt(l + 0)),
                q = this.deconvertVU(a.charCodeAt(l + 1)),
                h = this.deconvertVU(a.charCodeAt(l + 2)),
                m = this.deconvertVU(a.charCodeAt(l + 3)),
                r = this.deconvertVU_comp((a.charCodeAt(l + 6) & 127) << 1),
                p = 0 != (a.charCodeAt(l + 6) & 128),

                // TODO: check if pushed values for submix are correct (maybe post: h )
                //globalVUvalues.STRIPS.SUB[g].vu = [n, h, q, m, r, r, p, p],
                appData.vu["s." + g + ".mix"] = { pre: n, post: q };


        e += 7 * a.charCodeAt(2);
        for (g = 0; g < a.charCodeAt(3) && !(g >= appData.curSetup.fx); g++)
            l = e + 7 * g,
                n = this.deconvertVU(a.charCodeAt(l + 0)),
                q = this.deconvertVU(a.charCodeAt(l + 1)),
                h = this.deconvertVU(a.charCodeAt(l + 2)),
                m = this.deconvertVU(a.charCodeAt(l + 3)),
                r = this.deconvertVU_comp((a.charCodeAt(l + 6) & 127) << 1),
                p = 0 != (a.charCodeAt(l + 6) & 128),

                // TODO: check if pushed values for fx are correct
                //globalVUvalues.STRIPS.FX[g].vu = [n, h, q, m, r, r, p, p] (maybe post: h )
                appData.vu["fx." + g + ".mix"] = { pre: n, post: q };

        e += 7 * a.charCodeAt(3);
        for (g = 0; g < a.charCodeAt(4) && !(g >= appData.curSetup.aux); g++)
            l = e + 5 * g,
                n = this.deconvertVU(a.charCodeAt(l + 0)),
                q = this.deconvertVU(a.charCodeAt(l + 1)),
                r = this.deconvertVU_comp((a.charCodeAt(l + 4) & 127) << 1),
                p = 0 != (a.charCodeAt(l + 4) & 128),

                appData.vu["a." + g + ".mix"] = { pre: n, post: q };


        var l = e += 5 * a.charCodeAt(4),
            n = this.deconvertVU(a.charCodeAt(l + 0)),
            q = this.deconvertVU(a.charCodeAt(l + 1)),
            r = this.deconvertVU_comp((a.charCodeAt(l + 4) & 127) << 1),
            p = 0 != (a.charCodeAt(l + 4) & 128),
            h = this.deconvertVU(a.charCodeAt(l + 5)),
            m = this.deconvertVU(a.charCodeAt(l + 6)),
            g = this.deconvertVU_comp((a.charCodeAt(l + 9) & 127) << 1),
            t = 0 != (a.charCodeAt(l + 9) & 128);
        appData.vu["m.0.mix"] = { pre: n, post: q };
        appData.vu["m.1.mix"] = { pre: h, post: m };

        l = e += 5 * a.charCodeAt(6);
        m = this.deconvertVU(a.charCodeAt(l + 0));
        n = this.deconvertVU(a.charCodeAt(l + 1));
        q = this.deconvertVU(a.charCodeAt(l + 2));
        r = this.deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1);
        p = 0 != (a.charCodeAt(l + 5) & 128);


        appData.vu["l.0.mix"] = { pre: n, post: q };

        l = e + 6;
        m = this.deconvertVU(a.charCodeAt(l + 0));
        n = this.deconvertVU(a.charCodeAt(l + 1));
        q = this.deconvertVU(a.charCodeAt(l + 2));
        r = this.deconvertVU_comp((a.charCodeAt(l + 5) & 127) << 1);
        p = 0 != (a.charCodeAt(l + 5) & 128);
        appData.vu["l.1.mix"] = { pre: n, post: q };

        app.updateVuStrips();
    }

    deconvertVU(value) {
        return .004167508166392142 * value;
    }

    deconvertVU_comp(value) {
        // TODO: what is COMP_ZOOM and this function used for?
        const COMP_ZOOM = 2;
        value = (1 - .004167508166392142 * (value | value >> 7 & 1)) * COMP_ZOOM;
        .008 > value ? value = 0 : 1 < value && (value = 1);
        return value;
    }

}