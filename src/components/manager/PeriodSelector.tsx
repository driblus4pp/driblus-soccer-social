
import { Button } from "@/components/ui/button";

interface PeriodSelectorProps {
  selectedPeriod: 'monthly' | 'quarterly' | 'yearly';
  onPeriodChange: (period: 'monthly' | 'quarterly' | 'yearly') => void;
}

const PeriodSelector = ({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) => {
  const periods = [
    { key: 'monthly', label: 'Mensal' },
    { key: 'quarterly', label: 'Trimestral' },
    { key: 'yearly', label: 'Anual' }
  ];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.key}
          variant={selectedPeriod === period.key ? 'default' : 'outline'}
          onClick={() => onPeriodChange(period.key as any)}
          className={selectedPeriod === period.key ? 
            'bg-[#F35410] hover:bg-[#BA2D0B]' : 
            'border-white/20 text-white hover:bg-white/10'
          }
          size="sm"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default PeriodSelector;
