import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, ExternalLink, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateCardProps {
  recipientName?: string;
  recipientAvatar?: string;
  title?: string;
  organization?: string;
  mintDate?: string;
  technologies?: string[];
  isVerified?: boolean;
  className?: string;
}

function CertificateCard({
  recipientName = "Jake Palmer",
  recipientAvatar,
  title = "INTERNSHIP",
  organization = "Microsoft",
  mintDate = "June 2025",
  technologies = ["React", "Node.js", "Docker"],
  isVerified = true,
  className
}: CertificateCardProps) {
  return (
    <div className={cn("relative group", className)}>
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <Card className="relative bg-zinc-900 border-slate-700/50 rounded-3xl p-8 min-h-[500px] max-w-md mx-auto overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-slate-800 to-sinc-900"></div>
        
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header with avatar and verification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-14 w-14 ring-2 ring-cyan-400/30">
                  <AvatarImage src={recipientAvatar} alt={recipientName} />
                  <AvatarFallback className="bg-slate-700 text-slate-200">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{recipientName}</h3>
              </div>
            </div>
            
            {/* Verification badge */}
            <div className="bg-purple-600/20 p-3 rounded-full border border-purple-500/30">
              <CheckCircle className="h-6 w-6 text-purple-400" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

          {/* Main content */}
          <div className="text-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">
                {title}
              </h1>
              <h2 className="text-3xl font-bold text-white tracking-wide">
                @ {organization}
              </h2>
            </div>
            
            <p className="text-slate-400 text-lg">
              Mint Date {mintDate}
            </p>
          </div>

          {/* Institution verified badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="bg-slate-800/80 text-cyan-400 border-cyan-400/30 px-4 py-2 text-sm font-medium hover:bg-slate-700/80 transition-colors"
            >
              <Shield className="h-4 w-4 mr-2" />
              INSTITUTION-VERIFIED
            </Badge>
          </div>

          {/* Technology tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-slate-800/50 text-slate-200 border-slate-600/50 px-4 py-2 hover:bg-slate-700/50 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group/btn"
            >
              <ExternalLink className="h-4 w-4 mr-3 group-hover/btn:translate-x-0.5 transition-transform" />
              View Full Project
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group/btn"
            >
              <Shield className="h-4 w-4 mr-3 group-hover/btn:scale-110 transition-transform" />
              Verify on Blockchain
            </Button>
          </div>
        </div>

        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </Card>
    </div>
  );
}
export default CertificateCard;