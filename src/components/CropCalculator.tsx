
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import CropSelectionModal from './CropSelectionModal';

interface Crop {
  name: string;
  value: number;
}

interface GrowthMutation {
  name: string;
  emoji: string;
  multiplier: number;
}

interface TemperatureMutation {
  name: string;
  emoji: string;
  multiplier: number;
}

interface EnvironmentalMutation {
  name: string;
  emoji: string;
  multiplier: number;
}

const CropCalculator = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const [growthMutation, setGrowthMutation] = useState<string>('none');
  const [temperatureMutation, setTemperatureMutation] = useState<string>('none');
  const [selectedEnvironmentalMutations, setSelectedEnvironmentalMutations] = useState<string[]>([]);

  const growthMutations: GrowthMutation[] = [
    { name: 'none', emoji: '', multiplier: 1 },
    { name: 'golden', emoji: '🏆', multiplier: 20 },
    { name: 'rainbow', emoji: '🌈', multiplier: 50 },
    { name: 'shocked', emoji: '⚡', multiplier: 100 },
    { name: 'celestial', emoji: '✨', multiplier: 120 },
    { name: 'admin_blessed', emoji: '👑', multiplier: 125 }
  ];

  const temperatureMutations: TemperatureMutation[] = [
    { name: 'none', emoji: '', multiplier: 1 },
    { name: 'wet', emoji: '💧', multiplier: 2 },
    { name: 'chilled', emoji: '🧊', multiplier: 3 },
    { name: 'frozen', emoji: '❄️', multiplier: 5 }
  ];

  const environmentalMutationOptions: EnvironmentalMutation[] = [
    { name: 'chocolate', emoji: '🍫', multiplier: 1 },
    { name: 'moonlit', emoji: '🌙', multiplier: 1 },
    { name: 'bloodlit', emoji: '🩸', multiplier: 3 },
    { name: 'plasma', emoji: '⚡', multiplier: 4 },
    { name: 'zombified', emoji: '🧟', multiplier: 24 },
    { name: 'shocked_env', emoji: '⚡', multiplier: 99 },
    { name: 'celestial_env', emoji: '✨', multiplier: 119 },
    { name: 'disco', emoji: '🪩', multiplier: 124 }
  ];

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch('/crops.json');
        const data = await response.json();
        setCrops(data.crops);
        setSelectedCrop(data.crops[0]);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, []);

  const calculateValue = () => {
    const baseValue = customValue ? parseFloat(customValue) || 0 : (selectedCrop?.value || 0);
    const growthMultiplier = growthMutations.find(m => m.name === growthMutation)?.multiplier || 1;
    const temperatureMultiplier = temperatureMutations.find(m => m.name === temperatureMutation)?.multiplier || 1;
    
    const environmentalMultiplier = selectedEnvironmentalMutations.reduce((total, mutationName) => {
      const mutation = environmentalMutationOptions.find(m => m.name === mutationName);
      return total + (mutation?.multiplier || 0);
    }, selectedEnvironmentalMutations.length > 0 ? 0 : 1);

    return baseValue * growthMultiplier * temperatureMultiplier * (environmentalMultiplier || 1);
  };

  const getTotalMultiplier = () => {
    const growthMultiplier = growthMutations.find(m => m.name === growthMutation)?.multiplier || 1;
    const temperatureMultiplier = temperatureMutations.find(m => m.name === temperatureMutation)?.multiplier || 1;
    
    const environmentalMultiplier = selectedEnvironmentalMutations.reduce((total, mutationName) => {
      const mutation = environmentalMutationOptions.find(m => m.name === mutationName);
      return total + (mutation?.multiplier || 0);
    }, selectedEnvironmentalMutations.length > 0 ? 0 : 1);

    return growthMultiplier * temperatureMultiplier * (environmentalMultiplier || 1);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const handleEnvironmentalChange = (mutationName: string, checked: boolean) => {
    if (checked) {
      setSelectedEnvironmentalMutations([...selectedEnvironmentalMutations, mutationName]);
    } else {
      setSelectedEnvironmentalMutations(selectedEnvironmentalMutations.filter(m => m !== mutationName));
    }
  };

  const getMutationDisplayName = (mutation: GrowthMutation | TemperatureMutation | EnvironmentalMutation) => {
    if (mutation.name === 'none') return 'Default';
    if (mutation.name === 'admin_blessed') return 'Admin Blessed';
    if (mutation.name === 'shocked_env') return 'Shocked';
    if (mutation.name === 'celestial_env') return 'Celestial';
    return mutation.name.charAt(0).toUpperCase() + mutation.name.slice(1);
  };

  const getMultiplierDisplay = (mutation: GrowthMutation | TemperatureMutation) => {
    if (mutation.name === 'none') return `(×${mutation.multiplier})`;
    return `(×${mutation.multiplier})`;
  };

  const getEnvMultiplierDisplay = (mutation: EnvironmentalMutation) => {
    return `(+${mutation.multiplier})`;
  };

  const getTemperatureDisplay = (mutation: TemperatureMutation) => {
    if (mutation.name === 'none') return '(+0)';
    return `(+${mutation.multiplier - 1})`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Crop Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Select Crop</h2>
              <CropSelectionModal 
                crops={crops}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
              />
            </div>

            {/* Custom Value Input */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Minimum Base Value - Enter any value to be calculated</h2>
              <Input
                type="number"
                placeholder="248"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full h-16 text-lg bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>

            {/* Growth Mutations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                ⭐ Growth Mutations
              </h2>
              <RadioGroup value={growthMutation} onValueChange={setGrowthMutation} className="space-y-3">
                {growthMutations.map((mutation) => (
                  <div key={mutation.name} className="flex items-center space-x-3">
                    <RadioGroupItem value={mutation.name} id={`growth-${mutation.name}`} className="border-gray-400 text-blue-500" />
                    <Label 
                      htmlFor={`growth-${mutation.name}`} 
                      className="flex-1 cursor-pointer text-white"
                    >
                      {getMutationDisplayName(mutation)} {getMultiplierDisplay(mutation)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Temperature Mutations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                ❄️ Temperature Mutations
              </h2>
              <RadioGroup value={temperatureMutation} onValueChange={setTemperatureMutation} className="space-y-3">
                {temperatureMutations.map((mutation) => (
                  <div key={mutation.name} className="flex items-center space-x-3">
                    <RadioGroupItem value={mutation.name} id={`temp-${mutation.name}`} className="border-gray-400 text-blue-500" />
                    <Label 
                      htmlFor={`temp-${mutation.name}`} 
                      className="flex-1 cursor-pointer text-white"
                    >
                      {getMutationDisplayName(mutation)} {getTemperatureDisplay(mutation)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Environmental Mutations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                ✨ Other Environmental Mutations
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {environmentalMutationOptions.map((mutation) => (
                  <div key={mutation.name} className="flex items-center space-x-3">
                    <Checkbox
                      id={`env-${mutation.name}`}
                      checked={selectedEnvironmentalMutations.includes(mutation.name)}
                      onCheckedChange={(checked) => handleEnvironmentalChange(mutation.name, checked as boolean)}
                      className="border-gray-400"
                    />
                    <Label 
                      htmlFor={`env-${mutation.name}`} 
                      className="cursor-pointer text-white text-sm"
                    >
                      {getMutationDisplayName(mutation)} {getEnvMultiplierDisplay(mutation)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                🧮 The total value of the mutated crop
              </h2>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl">🪙</span>
                  <span className="text-5xl font-bold text-blue-400">{formatNumber(calculateValue())}</span>
                </div>
                <div className="text-gray-400">
                  Total Multiplier: <span className="text-blue-400">{getTotalMultiplier()}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCalculator;
