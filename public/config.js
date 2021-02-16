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
        defaultDbPos: 0.62,
        enabled: true,
        // cccsv: 'csv/cc/midicc-waldorf-blofeld.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Waldorf/Blofeld.csv'
    },
    {
        name: "GEM Rp-x",
        color: 9,
        inputChannels: [4,5],
        midiChannels: [4],
        defaultDbPos: 0.45,
        enabled: true,
        // cccsv: 'csv/cc/midicc-gem-rpx.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/GEM/rp-x.csv'
    },
    {
        name: "MicroKORG",
        color: 13,
        inputChannels: [6],
        midiChannels: [6],
        defaultDbPos: 0.8,
        enabled: true,
        // cccsv: 'csv/cc/midicc-korg-microkorg.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/KORG/micro KORG.csv'
    },
    {
        name: "System1",
        color: 6,
        inputChannels: [7],
        midiChannels: [5],
        defaultDbPos: 0.37,
        enabled: true,
        // cccsv: 'csv/cc/midicc-roland-system1.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Roland/System-1.csv'
    },
    {
        name: "Virus",
        color: 2,
        inputChannels: [8,9],
        midiChannels: [7],
        enabled: true,
        // cccsv: 'csv/cc/midicc-access-virus.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Access/Virus A.csv'
    },
    {
        name: "Axoloti",
        color: 8,
        inputChannels: [10],
        midiChannels: [],
        defaultDbPos: 0.57,
        enabled: true,
        cccsv: 'csv/cc/midicc-axoloti-buzz.csv'
    },
    {
        name: "JD-Xi",
        color: 16,
        inputChannels: [11],
        midiChannels: [1,2,3],
        defaultDbPos: 0.6,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Roland/JD-Xi.csv'
    },
    {
        name: "TB-3",
        color: 6,
        inputChannels: [14],
        midiChannels: [9],
        defaultDbPos: 0.6,
        enabled: true,
        // cccsv: 'csv/cc/midicc-roland-tb3.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Roland/TB-3.csv'
    },
    {
        name: "MFB Synth",
        color: 14,
        inputChannels: [15],
        midiChannels: [8],
        defaultDbPos: 0.42,
        enabled: false,
        // cccsv: 'csv/cc/midicc-mfb-synth2.csv'
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/MFB/Synth II.csv'
    },
    {
        name: "iPad",
        color: 11,
        inputChannels: [16,17],
        midiChannels: [12,13,14,15],
        defaultDbPos: 0.44,
        enabled: true
    },
    {
        name: "Disko",
        color: 7,
        inputChannels: [20,21],
        midiChannels: [],
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
        name: "3",
        color: 3,
        outputChannels: [4,5],
        fakeStereo: true,
        enabled: false
    },
    {
        name: "M",
        color: 8,
        outputChannels: [6],
        fakeStereo: false,
        enabled: false
    }
  ],

  /**
   * inputChannels & outputChannels are from ui24'rs point of view!!!
   */
  matrixOverConf: [
    {
        name: "DigiTakt",
        outputChannels: [9],
        inputChannels: [0,1],
        defaultDbPos: 0.62,
        color: 5,
        fakeStereo: false,
        groupUnique: false,
        enabled: true,
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Elektron/Digitakt.csv'
    },
    {
        name: "RMX-1000",
        outputChannels: [7],
        color: 1,
        inputChannels: [18,19],
        defaultDbPos: 0.59,
        fakeStereo: false,
        enabled: true
    },
    {
        name: "RC-505",
        outputChannels: [8],
        inputChannels: [12,13],
        defaultDbPos: 0.7,
        color: 3,
        fakeStereo: false,
        enabled: true
    }
  ],

  /**
   * those are only for CC csvs and not part of the mixer
   */
  additionalDevices: [
    {
        name: "System8",
        color: 6,
        inputChannels: [99],
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/Roland/System-8.csv'
    },
    {
        name: "MS2000",
        color: 13,
        inputChannels: [100],
        cccsv: 'https://raw.githubusercontent.com/othmar52/midi/main/KORG/MS2000.csv'
    },
    {
        name: "Casio CT-S300",
        color: 1,
        inputChannels: [101],
        cccsv: 'csv/cc/midicc-casio-cts300.csv'
    }
  ]
}
