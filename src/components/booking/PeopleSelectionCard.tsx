
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, AlertCircle } from "lucide-react";

interface PeopleSelectionCardProps {
  numberOfPeople: string;
  onPeopleChange: (people: string) => void;
  error?: string;
}

const PeopleSelectionCard = ({ numberOfPeople, onPeopleChange, error }: PeopleSelectionCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Quantas pessoas participarão?
          <span className="text-red-400">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="people" className="text-white">
            Número de pessoas esperadas (obrigatório)
          </Label>
          <Select 
            value={numberOfPeople} 
            onValueChange={onPeopleChange}
          >
            <SelectTrigger className={`bg-white/10 border-white/20 text-white ${error ? 'border-red-400' : ''}`}>
              <SelectValue placeholder="Selecione o número de pessoas" />
            </SelectTrigger>
            <SelectContent className="bg-[#062B4B] border-white/20">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10">
                  {num} {num === 1 ? 'pessoa' : 'pessoas'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeopleSelectionCard;
