import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dice1, Target } from "lucide-react";

interface GameToolsSectionProps {
  onTeamSorter: () => void;
  onScoreRecorder: () => void;
}

const GameToolsSection = ({ onTeamSorter, onScoreRecorder }: GameToolsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-50 px-1">Ferramentas de Jogo</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Card Sortear Times */}
        <Card 
          className="bg-[#062B4B] border-slate-600 cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={onTeamSorter}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">🎲</div>
            <div>
              <h3 className="text-white font-semibold text-lg">Sortear Times</h3>
            </div>
          </CardContent>
        </Card>

        {/* Card Registrar Pontuação */}
        <Card 
          className="bg-[#062B4B] border-slate-600 cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={onScoreRecorder}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">⚽</div>
            <div>
              <h3 className="text-white font-semibold text-lg">Registrar Pontuações</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameToolsSection;