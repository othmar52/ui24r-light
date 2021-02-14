<?php

$i = "
Modulation Wheel
Portamento Time
Channel Volume
Panorama
Osc1 Shape
Osc1 Pulsewidth
Osc1 Wave Select
Osc1 Semitone
Osc1 Keyfollow
Osc2 Shape
Osc2 Pulsewidth
Osc2 Wave Select
Osc2 Semitone
Osc2 Detune
Osc2 FM Amount
Osc2 Sync
Osc2 Filt Env Amt
FM Filt Env Amt
Osc2 Keyfollow
Bank Select
Osc Balance
Suboscillator Volume
Suboscillator Shape
Osc Mainvolume
Noise Volume
Cutoff
Cutoff2
Filter1 Resonance
Filter2 Resonance
Filter1 Env Amt
Filter2 Env Amt
Filter1 Keyfollow
Filter2 Keyfollow
Filter Balance
Saturation Curve
Filter1 Mode
Filter2 Mode
Filter Routing
Filter Env Attack
Filter Env Decay
Filter Env Sustain
Filter Env Sustain Time
Filter Env Release
Amp Env Attack
Amp Env Decay
Amp Env Sustain
Amp Env Sustain Time
Amp Env Release
Hold Pedal
Lfo1 Rate
Lfo1 Shape
Lfo1 Env Mode
Lfo1 Mode
Lfo1 Symmetry
Lfo1 Keyfollow Amt
Osc1 Lfo1 Amount
Osc2 Lfo1 Amount
PW Lfo1 Amount
Reso Lfo1 Amount
FiltGain Lfo1 Amount
Lfo2 Rate
Lfo2 Shape
Lfo2 Env Mode
Lfo2 Mode
Lfo2 Symmetry
Lfo2 Keytrigger
OscShape Lfo2 Amount
FmAmount Lfo2 Amount
Cutoff1 Lfo2 Amount
Cutoff2 Lfo2 Amount
Panorama Lfo2 Amount
Patch Volume
Transpose
Key Mode
Twin Mode
Twin Detune
Panorama Spread
Twin Lfo Phase
Input Mode
Input Select
Chorus Mix
Chorus Rate
Chorus Depth
Chorus Delay
Chorus Feedback
Chorus Lfo Shape
Effect Send
Delay Time
Delay Feedback
Delay Rate
Delay Depth
Delay Lfo Shape
All Notes Off
";

foreach (explode("\n", $i) as $x) {
    echo ucfirst(strtolower($x)) . "\n";
}
