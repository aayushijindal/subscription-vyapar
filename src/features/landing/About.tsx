import { Card } from '@/components/ui/Card';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12 text-left">
      <h1 className="text-4xl font-bold text-text-primary text-center">About First Computer ERP</h1>
      <p className="text-lg text-text-secondary leading-relaxed text-center max-w-2xl mx-auto">
        We build premium accounting and business management software designed to run growing Indian enterprises with transparency and efficiency.
      </p>

      <Card className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Our Mission</h2>
        <p className="text-text-secondary leading-relaxed text-sm">
          First Computer ERP was built to bridge the gap between traditional offline bookkeeping tools and high-scale SaaS products. By providing secure, GST-compliant interfaces accessible on mobile and web browsers, we enable retail shop operators and wholesale traders to digitize and manage billing smoothly.
        </p>
      </Card>
    </div>
  );
};


