
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Crop {
  name: string;
  value: number;
}

interface CropSelectionModalProps {
  crops: Crop[];
  selectedCrop: Crop | null;
  onSelectCrop: (crop: Crop) => void;
}

const CropSelectionModal = ({ crops, selectedCrop, onSelectCrop }: CropSelectionModalProps) => {
  const [open, setOpen] = React.useState(false);

  const handleCropSelect = (crop: Crop) => {
    onSelectCrop(crop);
    setOpen(false);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-16 text-left justify-start bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-lg">
          {selectedCrop ? selectedCrop.name : 'Select Crop'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-white">Select Your Crop</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {crops.map((crop) => (
            <Card 
              key={crop.name} 
              className={`cursor-pointer transition-all bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 ${
                selectedCrop?.name === crop.name ? 'ring-2 ring-blue-500 border-blue-500' : ''
              }`}
              onClick={() => handleCropSelect(crop)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{crop.name}</h3>
                <p className="text-gray-300">{formatNumber(crop.value)} coins</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CropSelectionModal;
