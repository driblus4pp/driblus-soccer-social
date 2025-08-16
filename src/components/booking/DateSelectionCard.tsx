
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateSelectionCardProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  error?: string;
}

const DateSelectionCard = ({ selectedDate, onDateChange, error }: DateSelectionCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Selecione a Data
          <span className="text-red-400">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          disabled={(date) => date < new Date() || date.getDay() === 0}
          className="bg-white/10 border-white/20 text-white"
          locale={ptBR}
          classNames={{
            day_selected: "bg-[#E4510F] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#E4510F] hover:text-white focus:bg-[#E4510F] focus:text-white",
            day_today: "bg-white/20 text-white hover:bg-white/30 hover:text-slate-900",
            day: "text-white hover:bg-white/20 hover:text-slate-900",
            head_cell: "text-white/70",
            caption_label: "text-white",
            nav_button: "text-white hover:bg-white/20 hover:text-slate-900 border-white/20"
          }}
        />
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateSelectionCard;
