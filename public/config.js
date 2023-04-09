var mixerConfig = {
  mixer1: {
    enabled: true,
    ip: '10.0.1.124',
    port: 80,
    autoConnect: true
  },
  mixer2: {
    enabled: false,
    ip: '10.0.1.126',
    port: 80,
    autoConnect: true
  },
  paramRecorder1: {
    enabled: false,
    ip: '10.0.1.147',
    port: 9801,
    autoConnect: true
  },
  paramRecorder2: {
    enabled: false,
    ip: '10.0.1.112',
    port: 8092,
    autoConnect: true
  },

  /**
   * inputChannels & outputChannels are from ui24'rs point of view!!!
   */
  matrixInputsConf: [
    {
        name: "Blofeld",
        color: 15,
        inputChannels: [2,3],
        midiChannels: [11],
        // defaultDbPos: 0.62,
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Waldorf/Blofeld.csv',
        patchcsv: [
            {
                displayName: 'Analog',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/Waldorf/Blofeld/Waldorf - Blofeld (Factory presets 2012).csv'
            }
        ]
    },
    {
        name: "GEM Rp-x",
        color: 9,
        inputChannels: [4,5],
        midiChannels: [4],
        // defaultDbPos: 0.45,
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/GEM/rp-x.csv',
        patchcsv: [
            {
                displayName: 'Analog',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/GEM/rp-x/GEM - rp-x (Factory presets 2006).csv'
            }
        ]
    },
    {
        name: "MicroKORG",
        color: 13,
        inputChannels: [6,7],
        midiChannels: [6],
        // defaultDbPos: 0.8,
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/KORG/micro KORG.csv',
        patchcsv: [
            {
                displayName: 'Cuckoo',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/KORG/micro KORG/KORG - micro KORG (Cuckoo patches 2018).csv'
            },
            {
                displayName: 'Factory',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/KORG/micro KORG/KORG - micro KORG (Factory presets 2002).csv'
            }
        ]
    },
    {
        name: "System1",
        color: 6,
        inputChannels: [15],
        midiChannels: [5],
        defaultDbPos: 0.5,
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Roland/System-1.csv',
        patchcsv: [
            {
                displayName: 'System-1',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/Roland/System-1/Roland - System-1 (Factory presets 2014).csv'
            },
            {
                displayName: 'Promars',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/Roland/System-1/Roland - System1 - Promars Plugout (Factory presets 2015).csv'
            }
        ]
    },
    {
        name: "Virus",
        color: 2,
        inputChannels: [8,9],
        midiChannels: [7],
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Access/Virus A.csv',
        patchcsv: [
            {
                displayName: 'Factory',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/Access/Virus A/Access - Virus A (Factory presets 1997).csv'
            }
        ]
    },
    {
        name: "Axoloti",
        color: 8,
        inputChannels: [10],
        midiChannels: [],
        // defaultDbPos: 0.57,
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'csv/cc/midicc-axoloti-buzz.csv'
    },
    {
        name: "JD-Xi",
        color: 16,
        inputChannels: [11],
        midiChannels: [1,2,3],
        // defaultDbPos: 0.6,
        // defaultDbPos: 1,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Roland/JD-Xi.csv',
        patchcsv: [
            {
                displayName: 'Analog',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/Roland/JD-Xi/Roland - JD-Xi (Factory presets 2015 analog).csv'
            },
            {
                displayName: 'Digital',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/Roland/JD-Xi/Roland - JD-Xi (Factory presets 2015 digital).csv'
            }
        ]
    },
    {
        name: "PELLA",
        color: 7,
        inputChannels: [14],
        // midiChannels: [9],
        // defaultDbPos: 0.6,
        // defaultDbPos: 1,
        enabled: true
        // cccsv: 'csv/cc/midicc-roland-tb3.csv'
        // cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Roland/TB-3.csv'
    },
    {
        name: "iPad",
        color: 11,
        inputChannels: [16,17],
        midiChannels: [12,13,14,15],
        // defaultDbPos: 0.44,
        // defaultDbPos: 1,
        enabled: true
    },
    {
        name: "Disko",
        color: 7,
        inputChannels: [20,21],
        midiChannels: [],
        // defaultDbPos: 1,
        enabled: false
    }
  ],

  matrixOutputsConf: [
    {
        name: "1",
        color: 14,
        outputChannels: [0,1],
        fakeStereo: true,
        enabled: true
    },
    {
        name: "2",
        color: 6,
        outputChannels: [2,3],
        fakeStereo: true,
        enabled: false
    },
    {
        name: "M",
        color: 8,
        outputChannels: [4],
        fakeStereo: false,
        enabled: false
    }
  ],

  /**
   * inputChannels & outputChannels are from Ui24R's point of view!!!
   */
  matrixOverConf: [
    {
        name: "DigiTakt",
        outputChannels: [5],
        inputChannels: [0,1],
        // defaultDbPos: 0.62,
        // defaultDbPos: 1,
        color: 5,
        fakeStereo: true,
        groupUnique: false,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Elektron/Digitakt.csv'
    },
    {
        name: "RMX-1000",
        outputChannels: [6,7],
        color: 1,
        inputChannels: [18,19],
        // defaultDbPos: 0.59,
        // defaultDbPos: 1,
        fakeStereo: false,
        enabled: true
    },
    {
        name: "RC-505",
        outputChannels: [8,9],
        inputChannels: [12,13],
        // defaultDbPos: 0.7,
        // defaultDbPos: 1,
        color: 3,
        fakeStereo: false,
        enabled: true
    }
  ],

  /**
   * those are only for CC csvs/patchlist csvs and not part of the mixer
   */
  additionalDevices: [
    {
        name: "System8",
        color: 6,
        inputChannels: [99],
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/Roland/System-8.csv'
    },
    {
        name: "MS2000",
        color: 13,
        inputChannels: [100],
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/KORG/MS2000.csv',
        patchcsv: [
            {
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/KORG/MS2000/KORG - MS2000 (Factory presets 2000).csv'
            }
        ]
    },
    {
        name: "Casio CT-S300",
        color: 1,
        inputChannels: [101],
        cccsv: 'csv/cc/midicc-casio-cts300.csv'
    },
    {
        name: "MFB Synth",
        color: 14,
        inputChannels: [103],
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/usagecolumn/MFB/Synth II.csv',
        patchcsv: [
            {
                displayName: 'Analog',
                url: 'https://raw.githubusercontent.com/othmar52/patchlist/main/MFB/Synth II/MFB - Synth II (Factory presets 2004).csv'
            }
        ]
    },
  ]
}
        // cccsv: 'csv/cc/midicc-mfb-synth2.csv'
