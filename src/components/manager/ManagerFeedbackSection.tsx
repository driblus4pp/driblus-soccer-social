import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FeedbackItem {
  id: string;
  courtName: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: Date;
  bookingId: string;
}

interface ManagerFeedbackSectionProps {
  managerId: string;
}

const mockFeedbacks: FeedbackItem[] = [
  {
    id: '1',
    courtName: 'Quadra Arena Sports',
    userName: 'João Silva',
    userEmail: 'joao@email.com',
    rating: 5,
    comment: 'Excelente quadra! Muito bem mantida e com ótima localização.',
    date: new Date('2024-12-20'),
    bookingId: 'booking-1'
  },
  {
    id: '2',
    courtName: 'Complexo Esportivo Central',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    rating: 4,
    comment: 'Boa estrutura, mas poderia melhorar a iluminação.',
    date: new Date('2024-12-19'),
    bookingId: 'booking-2'
  },
  {
    id: '3',
    courtName: 'Quadra do Parque',
    userName: 'Carlos Oliveira',
    userEmail: 'carlos@email.com',
    rating: 2,
    comment: 'Quadra em mal estado, precisa de manutenção urgente.',
    date: new Date('2024-12-18'),
    bookingId: 'booking-3'
  }
];

const ManagerFeedbackSection = ({ managerId }: ManagerFeedbackSectionProps) => {
  const [periodFilter, setPeriodFilter] = useState<'7d' | '30d' | '90d'>('30d');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filteredFeedbacks = mockFeedbacks.filter(feedback => {
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'positive' && feedback.rating >= 4) ||
                         (ratingFilter === 'negative' && feedback.rating <= 2);
    
    return matchesRating;
  });

  const averageRating = filteredFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / filteredFeedbacks.length;
  const positiveRatings = filteredFeedbacks.filter(f => f.rating >= 4).length;
  const negativeRatings = filteredFeedbacks.filter(f => f.rating <= 2).length;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return <Badge className="bg-green-100 text-green-800">Positivo</Badge>;
    if (rating >= 3) return <Badge className="bg-yellow-100 text-yellow-800">Neutro</Badge>;
    return <Badge className="bg-red-100 text-red-800">Negativo</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                <p className="text-xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Positivos</p>
                <p className="text-xl font-bold">{positiveRatings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Negativos</p>
                <p className="text-xl font-bold">{negativeRatings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as '7d' | '30d' | '90d')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ratingFilter} onValueChange={(value) => setRatingFilter(value as 'all' | 'positive' | 'negative')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar avaliações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="positive">Positivas</SelectItem>
            <SelectItem value="negative">Negativas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Feedbacks Recentes ({filteredFeedbacks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFeedbacks.map(feedback => (
              <div key={feedback.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{feedback.courtName}</h4>
                      {getRatingBadge(feedback.rating)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}/5
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{feedback.comment}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Por: {feedback.userName}</span>
                      <span>Em: {feedback.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Responder
                    </Button>
                    <Button variant="outline" size="sm">
                      Contatar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerFeedbackSection;