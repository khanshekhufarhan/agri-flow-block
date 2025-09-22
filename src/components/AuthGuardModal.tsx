import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AuthGuardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const AuthGuardModal = ({ open, onOpenChange, title = 'Authentication Required', description = 'Please sign up or log in to access the dashboard.' }: AuthGuardModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button asChild variant="outline">
            <Link to="/auth?tab=signin">Log In</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/auth?tab=signup">Sign Up</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthGuardModal;

