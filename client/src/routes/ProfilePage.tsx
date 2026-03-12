import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import {
  Mail,
  Calendar,
  Settings,
  Heart,
  Eye,
  TrendingDown,
  Trash2,
  Edit,
  LogOut,
  MapPin,
} from "lucide-react";

// Mock data - sostituire con chiamate API reali
const MOCK_USER = {
  id: "1",
  username: "techmaster",
  email: "tech@example.com",
  avatarUrl: null,
  bio: "PC building enthusiast since 2015. Always hunting for the best price/performance ratio.",
  location: "Milano, Italia",
  website: "https://techmaster.gg",
  joinedAt: "2023-01-15",
  stats: {
    buildsCount: 12,
    publicBuilds: 8,
    totalLikes: 245,
    totalViews: 3420,
  },
};

const MOCK_BUILDS = [
  {
    id: "1",
    name: "Gaming Beast 2024",
    description: "Configurazione top per gaming a 1440p ultra",
    totalPrice: 1850,
    totalWattage: 520,
    useCase: "GAMING",
    isPublic: true,
    viewsCount: 124,
    likesCount: 48,
    createdAt: "2024-01-15",
    components: [
      { category: "CPU", name: "AMD Ryzen 7 7800X3D" },
      { category: "VIDEO_CARD", name: "NVIDIA RTX 4080" },
      { category: "MEMORY", name: "32GB DDR5-6000" },
      { category: "STORAGE", name: "2TB NVMe SSD" },
    ],
  },
  {
    id: "2",
    name: "Workstation Lite",
    description: "Per video editing e rendering 3D",
    totalPrice: 2400,
    totalWattage: 650,
    useCase: "WORKSTATION",
    isPublic: true,
    viewsCount: 89,
    likesCount: 35,
    createdAt: "2024-02-20",
    components: [
      { category: "CPU", name: "AMD Ryzen 9 7950X" },
      { category: "VIDEO_CARD", name: "NVIDIA RTX 4090" },
      { category: "MEMORY", name: "64GB DDR5-6000" },
      { category: "STORAGE", name: "4TB NVMe SSD" },
    ],
  },
  {
    id: "3",
    name: "Budget Build",
    description: "Entry level gaming su AMD",
    totalPrice: 650,
    totalWattage: 350,
    useCase: "BUDGET",
    isPublic: false,
    viewsCount: 0,
    likesCount: 0,
    createdAt: "2024-03-10",
    components: [
      { category: "CPU", name: "AMD Ryzen 5 5600" },
      { category: "VIDEO_CARD", name: "AMD RX 7600" },
      { category: "MEMORY", name: "16GB DDR4-3200" },
      { category: "STORAGE", name: "512GB NVMe SSD" },
    ],
  },
];

const MOCK_ALERTS = [
  {
    id: "1",
    componentId: "comp1",
    componentName: "NVIDIA RTX 4080",
    targetPrice: 999,
    currentPrice: 1100,
    currency: "EUR",
    isActive: true,
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    componentId: "comp2",
    componentName: "AMD Ryzen 7 7800X3D",
    targetPrice: 299,
    currentPrice: 320,
    currency: "EUR",
    isActive: true,
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    componentId: "comp3",
    componentName: "Samsung 990 Pro 2TB",
    targetPrice: 150,
    currentPrice: 145,
    currency: "EUR",
    isActive: false,
    triggeredAt: "2024-03-01",
    createdAt: "2024-01-25",
  },
];

export default function ProfilePage() {
  const { username: _username } = useParams<{ username: string }>();
  const [isOwnProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("builds");

  const user = MOCK_USER;
  const builds = MOCK_BUILDS;
  const alerts = MOCK_ALERTS;

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl md:text-4xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    {user.username}
                  </h1>
                  <p className="text-muted-foreground mb-3">{user.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Membro dal {new Date(user.joinedAt).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                </div>

                {/* Actions - solo per proprio profilo */}
                {isOwnProfile && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifica Profilo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.buildsCount}</p>
                  <p className="text-sm text-muted-foreground">Build</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.publicBuilds}</p>
                  <p className="text-sm text-muted-foreground">Pubbliche</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.totalLikes}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                    <Heart className="h-3 w-3" /> Likes
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.totalViews}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                    <Eye className="h-3 w-3" /> Visualizzazioni
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      {isOwnProfile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="builds">Le Mie Build</TabsTrigger>
            <TabsTrigger value="alerts">Prezzi</TabsTrigger>
            <TabsTrigger value="settings">Impostazioni</TabsTrigger>
          </TabsList>

          {/* Builds Tab */}
          <TabsContent value="builds" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>

            {/* Create New Build Card */}
            <Link
              to="/builder"
              className="block border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <div className="text-muted-foreground">
                <p className="text-4xl mb-2">+</p>
                <p className="font-medium">Crea Nuova Build</p>
              </div>
            </Link>
          </TabsContent>

          {/* Price Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Avvisi Prezzo</CardTitle>
                    <CardDescription>
                      Ricevi notifiche quando i prezzi scendono
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Nuovo Avviso
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nessun avviso prezzo attivo</p>
                    <p className="text-sm mt-2">
                      Crea un avviso per ricevere notifiche quando i prezzi scendono
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profilo</CardTitle>
                  <CardDescription>Modifica le informazioni del tuo profilo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input
                      type="text"
                      value={user.username}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      defaultValue={user.bio}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                    />
                  </div>
                  <Button className="w-full">Salva Modifiche</Button>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Gestisci il tuo account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Cambia Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Notifiche Email
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Elimina Account
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Other user's profile - just show public builds
        <div>
          <h2 className="text-xl font-semibold mb-4">Build di {user.username}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.filter((b) => b.isPublic).map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BuildCard({ build }: { build: typeof MOCK_BUILDS[0] }) {
  return (
    <Link
      to={`/build/${build.id}`}
      className="block border border-border rounded-lg bg-card hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold truncate">{build.name}</h3>
          {build.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {build.description}
            </p>
          )}
        </div>
        <Badge variant={build.isPublic ? "default" : "secondary"} className="ml-2">
          {build.isPublic ? "Pubblica" : "Privata"}
        </Badge>
      </div>

      {/* Components Preview */}
      <div className="p-4">
        <div className="space-y-1">
          {build.components.slice(0, 4).map((component, idx) => (
            <div key={idx} className="text-sm flex items-center gap-2">
              <span className="text-muted-foreground w-24 truncate">
                {component.category.replace("_", " ")}
              </span>
              <span className="truncate flex-1">{component.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between text-sm">
        <div>
          <span className="font-bold text-primary">
            €{build.totalPrice.toLocaleString()}
          </span>
          <span className="text-muted-foreground ml-2">• {build.totalWattage}W</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          {build.isPublic && (
            <>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {build.viewsCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {build.likesCount}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions for own builds */}
      <div className="px-4 pb-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="h-3 w-3 mr-1" />
          Modifica
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Trash2 className="h-3 w-3 mr-1" />
          Elimina
        </Button>
      </div>
    </Link>
  );
}

function AlertItem({ alert }: { alert: typeof MOCK_ALERTS[0] }) {
  const priceDiff = ((alert.currentPrice - alert.targetPrice) / alert.targetPrice) * 100;
  const isTriggered = !alert.isActive;

  return (
    <div className={`p-4 border rounded-lg ${
      isTriggered ? "border-green-500 bg-green-500/5" : "border-border"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{alert.componentName}</h4>
            {isTriggered && (
              <Badge variant="default" className="bg-green-500">
                Target Raggiunto!
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-muted-foreground">Target: €{alert.targetPrice}</span>
            <span className={priceDiff <= 0 ? "text-green-500" : "text-muted-foreground"}>
              Attuale: €{alert.currentPrice}
            </span>
            {priceDiff > 0 && (
              <span className="text-muted-foreground">
                ({priceDiff.toFixed(1)}% sopra target)
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Key({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 18h6" />
      <path d="M3 18c0-4 4-8 9-8a9 9 0 0 1 9 9" />
      <circle cx="16" cy="13" r="2" />
    </svg>
  );
}
