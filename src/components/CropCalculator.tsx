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

  const environmentalMutationsList: EnvironmentalMutation[] = [
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
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, []);

  // Update custom value when crop is selected
  useEffect(() => {
    if (selectedCrop) {
      setCustomValue(selectedCrop.value.toString());
    }
  }, [selectedCrop]);

  const calculateValue = () => {
    const baseValue = customValue ? parseFloat(customValue) || 0 : (selectedCrop?.value || 0);
    const growthMultiplier = growthMutations.find(m => m.name === growthMutation)?.multiplier || 1;
    const temperatureMultiplier = temperatureMutations.find(m => m.name === temperatureMutation)?.multiplier || 1;
    
    const environmentalMultiplier = selectedEnvironmentalMutations.reduce((total, mutationName) => {
      const mutation = environmentalMutationsList.find(m => m.name === mutationName);
      return total + (mutation?.multiplier || 0);
    }, selectedEnvironmentalMutations.length > 0 ? 0 : 1);

    return baseValue * growthMultiplier * temperatureMultiplier * (environmentalMultiplier || 1);
  };

  const getTotalMultiplier = () => {
    const growthMultiplier = growthMutations.find(m => m.name === growthMutation)?.multiplier || 1;
    const temperatureMultiplier = temperatureMutations.find(m => m.name === temperatureMutation)?.multiplier || 1;
    
    const environmentalMultiplier = selectedEnvironmentalMutations.reduce((total, mutationName) => {
      const mutation = environmentalMutationsList.find(m => m.name === mutationName);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Crop & Base Value */}
          <div className="space-y-6">
            {/* Crop Selection Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  🌱 Select Crop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CropSelectionModal 
                  crops={crops}
                  selectedCrop={selectedCrop}
                  onSelectCrop={setSelectedCrop}
                />
              </CardContent>
            </Card>

            {/* Base Value Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  💰 Base Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  placeholder="Enter base value..."
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="h-12 text-lg bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Growth & Temperature */}
          <div className="space-y-6">
            {/* Growth Mutations Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  ⭐ Growth Mutations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={growthMutation} onValueChange={setGrowthMutation} className="space-y-3">
                  {growthMutations.map((mutation) => (
                    <div key={mutation.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                      <RadioGroupItem value={mutation.name} id={`growth-${mutation.name}`} className="border-slate-400 text-blue-500" />
                      <Label 
                        htmlFor={`growth-${mutation.name}`} 
                        className="flex-1 cursor-pointer text-white flex items-center gap-2"
                      >
                        {mutation.emoji && <span className="text-lg">{mutation.emoji}</span>}
                        <span>{getMutationDisplayName(mutation)}</span>
                        <span className="text-slate-400 ml-auto">{getMultiplierDisplay(mutation)}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Temperature Mutations Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  ❄️ Temperature Mutations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={temperatureMutation} onValueChange={setTemperatureMutation} className="space-y-3">
                  {temperatureMutations.map((mutation) => (
                    <div key={mutation.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                      <RadioGroupItem value={mutation.name} id={`temp-${mutation.name}`} className="border-slate-400 text-blue-500" />
                      <Label 
                        htmlFor={`temp-${mutation.name}`} 
                        className="flex-1 cursor-pointer text-white flex items-center gap-2"
                      >
                        {mutation.emoji && <span className="text-lg">{mutation.emoji}</span>}
                        <span>{getMutationDisplayName(mutation)}</span>
                        <span className="text-slate-400 ml-auto">{getTemperatureDisplay(mutation)}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Environmental Mutations */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  ✨ Environmental Mutations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {environmentalMutationsList.map((mutation) => (
                    <div key={mutation.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                      <Checkbox
                        id={`env-${mutation.name}`}
                        checked={selectedEnvironmentalMutations.includes(mutation.name)}
                        onCheckedChange={(checked) => handleEnvironmentalChange(mutation.name, checked as boolean)}
                        className="border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label 
                        htmlFor={`env-${mutation.name}`} 
                        className="cursor-pointer text-white text-sm flex items-center gap-2 flex-1"
                      >
                        {mutation.emoji && <span className="text-base">{mutation.emoji}</span>}
                        <span>{getMutationDisplayName(mutation)}</span>
                        <span className="text-slate-400 ml-auto">{getEnvMultiplierDisplay(mutation)}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Result Card - Moved to Bottom */}
        <div className="mt-6">
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                🧮 Total Value
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl font-bold text-white">{formatNumber(calculateValue())}</span>
              </div>
              <div className="text-slate-300 text-sm">
                Total Multiplier: <span className="text-blue-300 font-semibold">{getTotalMultiplier()}x</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CropCalculator;
