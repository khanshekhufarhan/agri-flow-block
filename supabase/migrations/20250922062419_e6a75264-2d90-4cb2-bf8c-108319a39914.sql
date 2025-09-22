-- Create enum types for different stakeholder roles and statuses
CREATE TYPE public.stakeholder_role AS ENUM ('farmer', 'distributor', 'retailer', 'consumer');
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.produce_status AS ENUM ('harvested', 'in_transit', 'at_distributor', 'at_retailer', 'sold_to_consumer');

-- Create profiles table for all stakeholders
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role stakeholder_role NOT NULL,
  full_name TEXT NOT NULL,
  mobile_number TEXT,
  aadhaar_number TEXT,
  verification_status verification_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farmer-specific details table
CREATE TABLE public.farmer_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pm_kisan_id TEXT,
  aadhaar_card_url TEXT,
  farm_address TEXT,
  farm_size_acres DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create distributor/wholesaler details table
CREATE TABLE public.distributor_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gstin_number TEXT NOT NULL,
  aadhaar_card_url TEXT,
  business_name TEXT,
  business_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create retailer details table
CREATE TABLE public.retailer_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gstin_number TEXT NOT NULL,
  fssai_license TEXT NOT NULL,
  aadhaar_card_url TEXT,
  business_name TEXT,
  business_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create produce batches table
CREATE TABLE public.produce_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  batch_code TEXT NOT NULL UNIQUE,
  crop_type TEXT NOT NULL,
  quantity_kg DECIMAL NOT NULL,
  harvest_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  quality_grade TEXT,
  price_per_kg DECIMAL NOT NULL,
  qr_code_url TEXT,
  status produce_status DEFAULT 'harvested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supply chain tracking table
CREATE TABLE public.supply_chain_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.produce_batches(id) ON DELETE CASCADE,
  from_stakeholder_id UUID REFERENCES public.profiles(id),
  to_stakeholder_id UUID REFERENCES public.profiles(id),
  transaction_type TEXT NOT NULL, -- 'farmer_to_distributor', 'distributor_to_retailer', 'retailer_to_consumer'
  quantity_kg DECIMAL NOT NULL,
  price_per_kg DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  truck_id TEXT,
  driver_name TEXT,
  driver_contact TEXT,
  delivery_date DATE,
  blockchain_hash TEXT, -- For blockchain transparency
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id UUID NOT NULL REFERENCES public.supply_chain_tracking(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES public.profiles(id),
  payee_id UUID NOT NULL REFERENCES public.profiles(id),
  amount DECIMAL NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for farmer details
CREATE POLICY "Farmers can manage their own details" 
ON public.farmer_details 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = farmer_details.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Create RLS policies for distributor details
CREATE POLICY "Distributors can manage their own details" 
ON public.distributor_details 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = distributor_details.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Create RLS policies for retailer details
CREATE POLICY "Retailers can manage their own details" 
ON public.retailer_details 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = retailer_details.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Create RLS policies for produce batches
CREATE POLICY "Farmers can manage their own batches" 
ON public.produce_batches 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = produce_batches.farmer_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "All authenticated users can view produce batches" 
ON public.produce_batches 
FOR SELECT 
TO authenticated
USING (true);

-- Create RLS policies for supply chain tracking
CREATE POLICY "Stakeholders can view their transactions" 
ON public.supply_chain_tracking 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE id IN (from_stakeholder_id, to_stakeholder_id)
  )
);

CREATE POLICY "Stakeholders can create transactions" 
ON public.supply_chain_tracking 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE id = from_stakeholder_id
  )
);

-- Create RLS policies for payments
CREATE POLICY "Payment participants can view payments" 
ON public.payments 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE id IN (payer_id, payee_id)
  )
);

-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for document uploads
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_details_updated_at
  BEFORE UPDATE ON public.farmer_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_distributor_details_updated_at
  BEFORE UPDATE ON public.distributor_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_retailer_details_updated_at
  BEFORE UPDATE ON public.retailer_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produce_batches_updated_at
  BEFORE UPDATE ON public.produce_batches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();