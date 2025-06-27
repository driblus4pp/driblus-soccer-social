
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

const ExportSection = () => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5" />
          Exportar Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-3" />
          Relatório Mensal (PDF)
        </Button>
        <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-3" />
          Dados Financeiros (Excel)
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportSection;
