import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type StakeholderRole = 'farmer' | 'distributor' | 'retailer' | 'consumer';

const PENDING_REG_KEY = 'pending_registration_v1';

const Auth = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [signinData, setSigninData] = useState({
    identifier: '',
    password: '',
    otp: '',
  });
  const [signupAccount, setSignupAccount] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState<StakeholderRole | ''>('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [signupProfile, setSignupProfile] = useState({
    fullName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    // Farmer
    pmKisanId: '',
    landOrFpoId: '',
    // Distributor/Retailer
    gstinNumber: '',
    tradeOrFssai: '',
    businessName: '',
    businessAddress: '',
  });

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigninData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupAccount(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSignupProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // For now, email/password sign-in. Identifier must be email.
    await signIn(signinData.identifier, signinData.password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupAccount.password !== signupAccount.confirmPassword) return;

    // Basic validations
    if (!role) {
      toast({ title: 'Select a role', description: 'Please choose your role to continue.', variant: 'destructive' });
      return;
    }
    if (signupProfile.aadhaarNumber && !/^\d{12}$/.test(signupProfile.aadhaarNumber)) {
      toast({ title: 'Invalid Aadhaar', description: 'Aadhaar must be 12 digits.', variant: 'destructive' });
      return;
    }
    if ((role === 'distributor' || role === 'retailer') && signupProfile.gstinNumber && !/^[0-9A-Z]{15}$/.test(signupProfile.gstinNumber)) {
      toast({ title: 'Invalid GSTIN', description: 'GSTIN must be 15 alphanumeric characters.', variant: 'destructive' });
      return;
    }
    if (signupProfile.mobileNumber && !/^\d{10}$/.test(signupProfile.mobileNumber)) {
      toast({ title: 'Invalid Mobile', description: 'Mobile must be 10 digits.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    // Stash pending registration in localStorage to complete after email verification
    const pending = {
      role,
      profile: signupProfile,
      aadhaarFileName: aadhaarFile ? aadhaarFile.name : null,
    };
    localStorage.setItem(PENDING_REG_KEY, JSON.stringify(pending));

    await signUp(signupAccount.email, signupAccount.password);
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!signinData.identifier) {
      toast({ title: 'Enter your email', description: 'Provide your email to receive reset link.' });
      return;
    }
    await resetPassword(signinData.identifier);
  };

  const roleLabel = useMemo(() => {
    if (role === 'farmer') return 'Land Record / FPO ID';
    if (role === 'distributor') return 'Trade License Upload (reference)';
    if (role === 'retailer') return 'FSSAI License Number';
    return '';
  }, [role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-3xl mx-auto relative">
        {/* Top-right Login / Sign Up buttons */}
        <div className="absolute right-0 -top-2 hidden sm:flex gap-2">
          <Button variant={activeTab === 'signin' ? 'hero' : 'outline'} size="sm" onClick={() => setActiveTab('signin')}>Log In</Button>
          <Button variant={activeTab === 'signup' ? 'hero' : 'outline'} size="sm" onClick={() => setActiveTab('signup')}>Sign Up</Button>
        </div>

        <Card className="w-full shadow-medium">
          <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            AgroConnect
          </CardTitle>
          <CardDescription>
            Blockchain-based supply chain transparency
          </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-identifier">Email / Aadhaar / Mobile</Label>
                    <Input
                      id="signin-identifier"
                      name="identifier"
                      type="text"
                      value={signinData.identifier}
                      onChange={handleSigninChange}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Use {useOtp ? 'OTP' : 'Password'}</Label>
                    <Button type="button" variant="link" onClick={() => setUseOtp(!useOtp)}>{useOtp ? 'Use Password' : 'Use OTP'}</Button>
                  </div>
                  {!useOtp ? (
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        value={signinData.password}
                        onChange={handleSigninChange}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="signin-otp">OTP</Label>
                      <Input
                        id="signin-otp"
                        name="otp"
                        type="text"
                        value={signinData.otp}
                        onChange={handleSigninChange}
                        inputMode="numeric"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-end -mt-2">
                    <Button type="button" variant="link" onClick={handleForgotPassword}>Forgot Password?</Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    variant="hero"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
            
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Account */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" name="email" type="email" value={signupAccount.email} onChange={handleSignupAccountChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" name="password" type="password" value={signupAccount.password} onChange={handleSignupAccountChange} required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" name="confirmPassword" type="password" value={signupAccount.confirmPassword} onChange={handleSignupAccountChange} required />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label>Select Your Role</Label>
                    <Select value={role} onValueChange={(val: StakeholderRole) => setRole(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your role in the supply chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="distributor">Distributor/Wholesaler</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="consumer">Consumer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Common fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Name</Label>
                      <Input id="fullName" name="fullName" value={signupProfile.fullName} onChange={handleSignupProfileChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile</Label>
                      <Input id="mobileNumber" name="mobileNumber" value={signupProfile.mobileNumber} onChange={handleSignupProfileChange} inputMode="numeric" />
                    </div>
                  </div>

                  {role !== 'consumer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                        <Input id="aadhaarNumber" name="aadhaarNumber" value={signupProfile.aadhaarNumber} onChange={handleSignupProfileChange} inputMode="numeric" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadhaarUpload">Upload Aadhaar (reference)</Label>
                        <Input id="aadhaarUpload" type="file" accept="image/*,.pdf" onChange={(e) => setAadhaarFile(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                  )}

                  {/* Farmer */}
                  {role === 'farmer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pmKisanId">PM-Kisan Registration ID (optional)</Label>
                        <Input id="pmKisanId" name="pmKisanId" value={signupProfile.pmKisanId} onChange={handleSignupProfileChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landOrFpoId">{roleLabel}</Label>
                        <Input id="landOrFpoId" name="landOrFpoId" value={signupProfile.landOrFpoId} onChange={handleSignupProfileChange} />
                      </div>
                    </div>
                  )}

                  {/* Distributor */}
                  {role === 'distributor' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gstinNumber">GSTIN</Label>
                        <Input id="gstinNumber" name="gstinNumber" value={signupProfile.gstinNumber} onChange={handleSignupProfileChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradeOrFpo">Trade License Upload (reference)</Label>
                        <Input id="tradeOrFpo" type="file" accept="image/*,.pdf" onChange={() => {}} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input id="businessName" name="businessName" value={signupProfile.businessName} onChange={handleSignupProfileChange} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Textarea id="businessAddress" name="businessAddress" value={signupProfile.businessAddress} onChange={handleSignupProfileChange} />
                      </div>
                    </div>
                  )}

                  {/* Retailer */}
                  {role === 'retailer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gstinNumber">GSTIN</Label>
                        <Input id="gstinNumber" name="gstinNumber" value={signupProfile.gstinNumber} onChange={handleSignupProfileChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradeOrFssai">FSSAI License Number</Label>
                        <Input id="tradeOrFssai" name="tradeOrFssai" value={signupProfile.tradeOrFssai} onChange={handleSignupProfileChange} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input id="businessName" name="businessName" value={signupProfile.businessName} onChange={handleSignupProfileChange} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Textarea id="businessAddress" name="businessAddress" value={signupProfile.businessAddress} onChange={handleSignupProfileChange} />
                      </div>
                    </div>
                  )}

                  {/* Consumer */}
                  {role === 'consumer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP (will be sent to mobile)</Label>
                        <Input id="otp" name="otp" value={''} onChange={() => {}} placeholder="Enter OTP" />
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || signupAccount.password !== signupAccount.confirmPassword}
                    variant="hero"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our terms of service and privacy policy.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;