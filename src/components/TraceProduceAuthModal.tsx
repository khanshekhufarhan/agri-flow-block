import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TraceProduceAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TraceProduceAuthModal = ({ open, onOpenChange }: TraceProduceAuthModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Please log in or sign up to trace produce and access the full supply chain transparency features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-6">
          <Button 
            asChild 
            size="lg" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            <Link to="/auth?tab=signin" className="flex items-center justify-center">
              <LogIn className="mr-2 h-5 w-5" />
              Log In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            <Link to="/auth?tab=signup" className="flex items-center justify-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            New to AgroConnect? Sign up to get started with transparent food tracking.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TraceProduceAuthModal;