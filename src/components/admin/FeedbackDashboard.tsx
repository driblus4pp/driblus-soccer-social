import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, TrendingUp, TrendingDown, MessageSquare, Filter } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";

const FeedbackDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const { getRatings } = useBookings();

  const allFeedbacks = getRatings();

  const filteredFeedbacks = allFeedbacks.filter(feedback => {
    const matchesSearch = feedback.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'high' && feedback.stars >= 4) ||
                         (ratingFilter === 'low' && feedback.stars <= 2);
    
    return matchesSearch && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.stars - a.stars;
  });

  const averageRating = allFeedbacks.length > 0 
    ? allFeedbacks.reduce((acc, feedback) => acc + feedback.stars, 0) / allFeedbacks.length 
    : 0;
  const highRatings = allFeedbacks.filter(f => f.stars >= 4).length;
  const lowRatings = allFeedbacks.filter(f => f.stars <= 2).length;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (stars: number) => {
    if (stars >= 4) return <Badge className="bg-green-100 text-green-800">Positivo</Badge>;
    if (stars >= 3) return <Badge className="bg-yellow-100 text-yellow-800">Neutro</Badge>;
    return <Badge className="bg-red-100 text-red-800">Negativo</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliações Positivas</p>
                <p className="text-2xl font-bold">{highRatings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliações Negativas</p>
                <p className="text-2xl font-bold">{lowRatings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por quadra ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as avaliações</SelectItem>
                <SelectItem value="high">Positivas (4-5 estrelas)</SelectItem>
                <SelectItem value="low">Negativas (1-2 estrelas)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'rating')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="rating">Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                      {getRatingBadge(feedback.stars)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.stars
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(feedback.stars)}`}>
                        {feedback.stars}/5
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{feedback.comment}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Por: {feedback.userName}</span>
                      <span>Em: {new Date(feedback.createdAt).toLocaleDateString()}</span>
                      <span>Agendamento: {feedback.date} às {feedback.startTime}</span>
                      <span>Gestor: {feedback.managerId}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      Contatar Cliente
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

export default FeedbackDashboard;