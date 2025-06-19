
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, MapPin, Info } from 'lucide-react';

interface PaymentMethodProps {
  court: any;
  bookingData: any;
  onNext: () => void;
}

const PaymentMethod = ({ court, bookingData, onNext }: PaymentMethodProps) => {
  const [paymentMethod, setPaymentMethod] = useState('court');
  
  const courtPrice = parseInt(court.price.replace('R$ ', '').replace('/hora', ''));
  const totalPrice = courtPrice + bookingData.serviceFee;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Forma de Pagamento</h2>
        <p className="text-white/70">Escolha como deseja pagar sua reserva</p>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Selecione a forma de pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:bg-white/5 transition-colors">
              <RadioGroupItem value="online" id="online" className="border-white/40" />
              <Label htmlFor="online" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-white/70" />
                  <div>
                    <p className="text-white font-semibold">Pagar Agora</p>
                    <p className="text-white/70 text-sm">Cartão de crédito ou débito</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border border-[#F35410] bg-[#F35410]/10 transition-colors">
              <RadioGroupItem value="court" id="court" className="border-[#F35410]" />
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

      {paymentMethod === 'court' && (
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
      )}

      {/* Price Summary */}
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-white font-semibold">Total a pagar</h4>
              <p className="text-white/70 text-sm">
                {paymentMethod === 'court' ? 'No dia do agendamento' : 'Agora'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#F35410]">R$ {totalPrice},00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={onNext}
          className="w-full bg-[#F35410] hover:bg-[#BA2D0B] text-white font-semibold py-3"
        >
          Confirmar Agendamento
        </Button>
        <p className="text-white/60 text-xs text-center">
          Ao confirmar, você concorda com os termos de uso e política de cancelamento.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;
