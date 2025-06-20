import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  filters: FilterState;
}
export interface FilterState {
  city: string;
  neighborhood: string;
  modality: string;
  operatingHours: string;
}
const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  filters
}: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  if (!isOpen) return null;
  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };
  const handleCancel = () => {
    setLocalFilters(filters);
    onClose();
  };
  return <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#062B4B] border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Filtros</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-white/90 text-sm">Cidade</label>
            <Select value={localFilters.city} onValueChange={value => setLocalFilters({
            ...localFilters,
            city: value
          })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent className="bg-[#062B4B] border-white/20">
                <SelectItem value="sao-paulo" className="text-white focus:bg-white/20">São Paulo</SelectItem>
                <SelectItem value="fortaleza" className="text-white focus:bg-white/20">Fortaleza</SelectItem>
                <SelectItem value="rio-de-janeiro" className="text-white focus:bg-white/20">Rio de Janeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm">Bairro</label>
            <Select value={localFilters.neighborhood} onValueChange={value => setLocalFilters({
            ...localFilters,
            neighborhood: value
          })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent className="bg-[#062B4B] border-white/20">
                <SelectItem value="centro" className="text-white focus:bg-white/20">Centro</SelectItem>
                <SelectItem value="paulista" className="text-white focus:bg-white/20">Paulista</SelectItem>
                <SelectItem value="augusta" className="text-white focus:bg-white/20">Augusta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm">Modalidade</label>
            <Select value={localFilters.modality} onValueChange={value => setLocalFilters({
            ...localFilters,
            modality: value
          })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent className="bg-[#062B4B] border-white/20">
                <SelectItem value="futebol" className="text-white focus:bg-white/20">Futebol</SelectItem>
                <SelectItem value="volei" className="text-white focus:bg-white/20">Vôlei</SelectItem>
                <SelectItem value="basquete" className="text-white focus:bg-white/20">Basquete</SelectItem>
                <SelectItem value="tenis" className="text-white focus:bg-white/20">Tênis</SelectItem>
                <SelectItem value="beach-tennis" className="text-white focus:bg-white/20">Beach Tennis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm">Horário de funcionamento</label>
            <Select value={localFilters.operatingHours} onValueChange={value => setLocalFilters({
            ...localFilters,
            operatingHours: value
          })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent className="bg-[#062B4B] border-white/20">
                <SelectItem value="24h" className="text-white focus:bg-white/20">24 horas</SelectItem>
                <SelectItem value="manha" className="text-white focus:bg-white/20">Manhã (6h-12h)</SelectItem>
                <SelectItem value="tarde" className="text-white focus:bg-white/20">Tarde (12h-18h)</SelectItem>
                <SelectItem value="noite" className="text-white focus:bg-white/20">Noite (18h-24h)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1 border-white/20 bg-gray-500 hover:bg-gray-400 text-zinc-950">
              Cancelar
            </Button>
            <Button onClick={handleApply} className="flex-1 bg-[#F35410] hover:bg-[#BA2D0B] text-white">
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default FilterModal;