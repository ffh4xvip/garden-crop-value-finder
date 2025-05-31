
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
    { name: 'chocolate', emoji: '🍫', multiplier: 10 },
    { name: 'moonlit', emoji: '🌙', multiplier: 15 },
    { name: 'glowing', emoji: '💡', multiplier: 8 },
    { name: 'sparkling', emoji: '✨', multiplier: 6 }
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
    if (!selectedCrop) return 0;

    const baseValue = selectedCrop.value;
    const growthMultiplier = growthMutations.find(m => m.name === growthMutation)?.multiplier || 1;
    const temperatureMultiplier = temperatureMutations.find(m => m.name === temperatureMutation)?.multiplier || 1;
    
    const environmentalMultiplier = selectedEnvironmentalMutations.reduce((total, mutationName) => {
      const mutation = environmentalMutationOptions.find(m => m.name === mutationName);
      return total + (mutation?.multiplier || 0);
    }, selectedEnvironmentalMutations.length > 0 ? 0 : 1);

    return baseValue * growthMultiplier * temperatureMultiplier * (environmentalMultiplier || 1);
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
    if (mutation.name === 'none') return 'None';
    if (mutation.name === 'admin_blessed') return 'Admin Blessed';
    return mutation.name.charAt(0).toUpperCase() + mutation.name.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            🌱 Garden Crop Calculator
          </h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Calculate your crop's value based on mutations. Actual price depends on plant size - these are minimum values.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Crop Selection */}
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  🌾 Select Your Crop
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Select
                  value={selectedCrop?.name || ''}
                  onValueChange={(value) => {
                    const crop = crops.find(c => c.name === value);
                    setSelectedCrop(crop || null);
                  }}
                >
                  <SelectTrigger className="w-full h-12 text-lg border-green-300 focus:border-green-500">
                    <SelectValue placeholder="Choose a crop..." />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.name} value={crop.name} className="text-lg py-3">
                        {crop.name} ({formatNumber(crop.value)} coins)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Growth Mutations */}
            <Card className="shadow-lg border-yellow-200">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  🌟 Growth Mutations (Select One)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={growthMutation} onValueChange={setGrowthMutation} className="space-y-3">
                  {growthMutations.map((mutation) => (
                    <div key={mutation.name} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                      <RadioGroupItem value={mutation.name} id={`growth-${mutation.name}`} className="border-yellow-400" />
                      <Label 
                        htmlFor={`growth-${mutation.name}`} 
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {mutation.emoji && <span className="text-xl">{mutation.emoji}</span>}
                          <span className="font-medium">{getMutationDisplayName(mutation)}</span>
                        </span>
                        <span className="text-yellow-600 font-bold">{mutation.multiplier}x</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Temperature Mutations */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  ❄️ Temperature Mutations (Select One)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={temperatureMutation} onValueChange={setTemperatureMutation} className="space-y-3">
                  {temperatureMutations.map((mutation) => (
                    <div key={mutation.name} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                      <RadioGroupItem value={mutation.name} id={`temp-${mutation.name}`} className="border-blue-400" />
                      <Label 
                        htmlFor={`temp-${mutation.name}`} 
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {mutation.emoji && <span className="text-xl">{mutation.emoji}</span>}
                          <span className="font-medium">{getMutationDisplayName(mutation)}</span>
                        </span>
                        <span className="text-blue-600 font-bold">{mutation.multiplier}x</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Environmental Mutations */}
            <Card className="shadow-lg border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  ✨ Other Environmental Mutations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {environmentalMutationOptions.map((mutation) => (
                    <div key={mutation.name} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <Checkbox
                        id={`env-${mutation.name}`}
                        checked={selectedEnvironmentalMutations.includes(mutation.name)}
                        onCheckedChange={(checked) => handleEnvironmentalChange(mutation.name, checked as boolean)}
                        className="border-purple-400"
                      />
                      <Label 
                        htmlFor={`env-${mutation.name}`} 
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{mutation.emoji}</span>
                          <span className="font-medium">{getMutationDisplayName(mutation)}</span>
                        </span>
                        <span className="text-purple-600 font-bold">{mutation.multiplier}x</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="shadow-xl border-green-300 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="text-center text-xl">
                  💰 Calculated Minimum Value
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-5xl md:text-6xl font-bold text-green-700 mb-2">
                    {formatNumber(calculateValue())}
                  </div>
                  <div className="text-xl text-green-600 font-semibold">
                    coins
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium flex items-center justify-center gap-2">
                    <span>⚠️</span>
                    <span>Note: This is the minimum value of your plant. The actual value depends on the plant size.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCalculator;
