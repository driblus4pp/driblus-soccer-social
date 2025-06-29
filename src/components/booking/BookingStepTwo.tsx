
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Info } from 'lucide-react';

interface BookingStepTwoProps {
  court: any;
  bookingData: any;
  userData: any;
  onNext: () => void;
}

const BookingStepTwo = ({ court, bookingData, userData, onNext }: BookingStepTwoProps) => {
  const courtPrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Forma de Pagamento</h2>
        <p className="text-white/70">Como você deseja pagar sua reserva?</p>
      </div>

      {/* Payment Method */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Método de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value="court" className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-[#F35410] bg-[#F35410]/10">
              <RadioGroupItem value="court" id="court" className="border-[#F35410]" checked />
              <Label htmlFor="court" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#F35410]" />
                  <div>
                    <p className="text-white font-semibold">Pagar na Quadra</p>
                    <p className="text-white/70 text-sm">Dinheiro, PIX ou cartão no local</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="bg-blue-600/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-200 font-semibold mb-2">Pagamento no Local</h4>
              <p className="text-blue-200/90 text-sm">
                Você pagará diretamente na quadra no dia do seu agendamento. 
                Formas de pagamento aceitas: dinheiro, PIX ou cartão.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Resumo da Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-white">
            <div className="flex justify-between">
              <span>Quadra:</span>
              <span className="font-semibold">{court.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Data e Horário:</span>
              <span className="font-semibold">{bookingData.formattedDateTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span className="font-semibold">{userData.name}</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-[#F35410]">R$ {courtPrice},00</span>
              </div>
              <p className="text-white/70 text-sm text-right">Pagamento no local</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onNext}
        className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3"
      >
        Confirmar Agendamento
      </Button>
    </div>
  );
};

export default BookingStepTwo;
