import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, X } from "lucide-react";
import { Booking } from '@/types';

interface FeedbackBannerProps {
  booking: Booking;
  onRate: (booking: Booking) => void;
  onDismiss: (bookingId: string) => void;
}

const FeedbackBanner = ({ booking, onRate, onDismiss }: FeedbackBannerProps) => {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={booking.courtImage} 
              alt={booking.courtName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-foreground">Como foi sua experiência?</p>
              <p className="text-sm text-muted-foreground">
                {booking.courtName} • {booking.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onRate(booking)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <Star className="w-4 h-4 mr-1" />
              Avaliar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDismiss(booking.id)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackBanner;