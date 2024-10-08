import { DollarSign, Hammer, Wrench, Droplet, ShieldAlert, MapPin, Settings, Layers, Package, Home } from 'lucide-react';

export const supportMethodIcons = {
  'Cash-for-Work': <DollarSign className="text-green-500" size={16} />,
  'Conditional cash transfer': <DollarSign className="text-blue-500" size={16} />,
  'Restricted cash/voucher': <DollarSign className="text-red-500" size={16} />,
  'Unconditional & Unrestricted': <DollarSign className="text-yellow-500" size={16} />,
  'Loans / Micro-credits etc.': <DollarSign className="text-orange-500" size={16} />,
  'Household items': <Package className="text-purple-500" size={16} />,
  'Shelter materials (incl. kits)': <Hammer className="text-gray-500" size={16} />,
  'Tools/Fixings': <Wrench className="text-pink-500" size={16} />,
  'WASH items (& kits)': <Droplet className="text-blue-500" size={16} />,
  'Advocacy / Legal assistance': <ShieldAlert className="text-red-500" size={16} />,
  'Site / Settlement planning': <MapPin className="text-green-500" size={16} />,
  'Infrastructure': <Settings className="text-blue-500" size={16} />,
  'Training / Capacity Building': <Layers className="text-orange-500" size={16} />,
  'Tech. Assistance / Quality Assurance': <Layers className="text-orange-500" size={16} />,
  'Structural Assessment': <Layers className="text-orange-500" size={16} />,
  'Guidelines / Mass communication': <Layers className="text-orange-500" size={16} />,
  'Site Management': <Layers className="text-orange-500" size={16} />,
  'Debris / Rubble Removal': <Layers className="text-orange-500" size={16} />,
};

export const shelterAssistanceIcons = {
  'Emergency shelter': <Hammer className="text-red-500" size={16} />,
  'Transitional/semi-permanent shelter': <Package className="text-blue-500" size={16} />,
  'Host family support': <MapPin className="text-green-500" size={16} />,
  'Rental support': <DollarSign className="text-orange-500" size={16} />,
  'Core housing': <Home className="text-yellow-500" size={16} />,
  'Housing repair/retrofit/rehabilitation': <Wrench className="text-gray-500" size={16} />,
};