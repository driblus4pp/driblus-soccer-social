
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from 'lucide-react';

interface BookingDetailsProps {
  court: any;
  bookingData: any;
  onNext: () => void;
  onUpdateData: (data: any) => void;
}

const BookingDetails = ({ court, bookingData, onNext, onUpdateData }: BookingDetailsProps) => {
  const [formData, setFormData] = useState({
    numberOfPeople: bookingData.numberOfPeople.toString(),
    observations: bookingData.observations,
    needsEquipment: bookingData.needsEquipment
  });

  const handleContinue = () => {
    onUpdateData({
      numberOfPeople: parseInt(formData.numberOfPeople),
      observations: formData.observations,
      needsEquipment: formData.needsEquipment
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Detalhes da Reserva</h2>
        <p className="text-white/70">Preencha os dados para sua reserva</p>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Informações da Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="people" className="text-white">Número de pessoas</Label>
            <Select value={formData.numberOfPeople} onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfPeople: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecione o número de pessoas" />
              </SelectTrigger>
              <SelectContent className="bg-[#062B4B] border-white/20">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10">
                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations" className="text-white">Observações (opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Adicione observações sobre sua reserva..."
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="equipment"
              checked={formData.needsEquipment}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needsEquipment: !!checked }))}
              className="border-white/20"
            />
            <Label htmlFor="equipment" className="text-white cursor-pointer">
              Preciso de equipamentos
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-white">{court.name}</h4>
              <p className="text-white/70 text-sm">20 de dezembro • 19:00 - 20:00</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#F35410]">{court.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleContinue}
        className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3"
      >
        Continuar para Pagamento
      </Button>
    </div>
  );
};

export default BookingDetails;
