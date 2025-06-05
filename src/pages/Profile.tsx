import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  MapPin,
  Settings,
  Camera,
  Save,
  Star,
  ShoppingBag,
  MessageSquare,
  Calendar,
  Verified,
  Phone,
  Mail,
  Edit3,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  CreditCard,
  Smartphone,
  Laptop,
  UserCheck,
  Activity,
  HelpCircle,
  LogOut,
  Database,
  Filter,
  BarChart3,
  Store,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TicketSummary } from "@/components/TicketSummary";
import { FollowedShops } from "@/components/FollowedShops";
import { useUser } from "@/contexts/UserContext";
import { useShop } from "@/contexts/ShopContext";
import { UserProfile } from "@/types/user";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateUser, stats } = useUser();
  const { getFollowedShopsCount } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("account");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handlePreferencesChange = (field: string, value: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatJoinDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleExportData = () => {
    toast.success("Data export started. You'll receive an email when ready.");
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      toast.error(
        "Account deletion request submitted. Check your email for confirmation.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Profile Header */}
        <div className="mb-8">
          <Card className="overflow-hidden border-0 shadow-xl">
            {/* Background Pattern */}
            <div className="h-32 bg-gradient-to-r from-[#1890ff] via-[#722ed1] to-[#eb2f96] relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
            </div>

            <CardContent className="p-8 -mt-16 relative">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Profile Picture Section */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-32 w-32 border-6 border-white shadow-xl">
                    <AvatarImage
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] text-white text-2xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-10 w-10 bg-white text-[#1890ff] hover:bg-gray-50 shadow-lg border-2 border-white"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                  {user.isVerified && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-green-500 rounded-full p-2 border-4 border-white">
                        <Verified className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </h1>
                        <div className="flex gap-2">
                          {user.isVerified && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <Verified className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 max-w-2xl">
                        {user.bio ||
                          "No bio added yet. Tell others about yourself!"}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {formatJoinDate(user.joinedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {user.address.city}, {user.address.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 lg:gap-6">
                      <Card className="p-4 text-center border-l-4 border-l-blue-500">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalSaved}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          Saved
                        </div>
                      </Card>
                      <Card className="p-4 text-center border-l-4 border-l-green-500">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalPurchases}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          Purchases
                        </div>
                      </Card>
                      <Card className="p-4 text-center border-l-4 border-l-purple-500">
                        <div className="text-2xl font-bold text-gray-900">
                          {getFollowedShopsCount()}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <Store className="h-3 w-3" />
                          Following
                        </div>
                      </Card>
                      <Card className="p-4 text-center border-l-4 border-l-yellow-500">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.reviewsGiven}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <Star className="h-3 w-3" />
                          Reviews
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Activity className="h-4 w-4" />
                    Activity Log
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="personal" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 h-14 p-1 bg-white border shadow-sm">
            <TabsTrigger
              value="personal"
              className="gap-2 data-[state=active]:bg-[#1890ff] data-[state=active]:text-white"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="gap-2 data-[state=active]:bg-[#1890ff] data-[state=active]:text-white"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Address</span>
            </TabsTrigger>
            <TabsTrigger
              value="shops"
              className="gap-2 data-[state=active]:bg-[#1890ff] data-[state=active]:text-white"
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Shops</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="gap-2 data-[state=active]:bg-[#1890ff] data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:bg-[#1890ff] data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="gap-2 data-[state=active]:bg-[#1890ff] data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
          </TabsList>
          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-[#1890ff]" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          disabled={!isEditing}
                          className={cn(isEditing && "ring-2 ring-blue-100")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          disabled={!isEditing}
                          className={cn(isEditing && "ring-2 ring-blue-100")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            disabled={!isEditing}
                            className={cn(
                              "pl-10",
                              isEditing && "ring-2 ring-blue-100",
                            )}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            disabled={!isEditing}
                            className={cn(
                              "pl-10",
                              isEditing && "ring-2 ring-blue-100",
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth || ""}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          disabled={!isEditing}
                          className={cn(isEditing && "ring-2 ring-blue-100")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender || "not-selected"}
                          onValueChange={(value) =>
                            handleInputChange(
                              "gender",
                              value === "not-selected" ? "" : value,
                            )
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger
                            className={cn(isEditing && "ring-2 ring-blue-100")}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-selected">
                              Select gender
                            </SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ""}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className={cn(isEditing && "ring-2 ring-blue-100")}
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {(formData.bio || "").length}/500
                      </div>
                    </div>

                    {isEditing && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Fields marked with * are required. Changes will be
                          saved when you click "Save Changes".
                        </AlertDescription>
                      </Alert>
                    )}

                    {isEditing && (
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={handleSave}
                          className="gap-2 bg-gradient-to-r from-[#1890ff] to-[#722ed1]"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Email Verified</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Phone Verified</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Identity Verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Profile Strength</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-[#1890ff] to-[#722ed1] h-2 rounded-full w-[85%]"></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Add profile picture and complete address to reach 100%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#1890ff]" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      disabled={!isEditing}
                      className={cn(isEditing && "ring-2 ring-blue-100")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment/Unit</Label>
                    <Input
                      id="apartment"
                      value={formData.address.apartment || ""}
                      onChange={(e) =>
                        handleAddressChange("apartment", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Apt 123, Suite 456"
                      className={cn(isEditing && "ring-2 ring-blue-100")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      disabled={!isEditing}
                      className={cn(isEditing && "ring-2 ring-blue-100")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      disabled={!isEditing}
                      className={cn(isEditing && "ring-2 ring-blue-100")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        handleAddressChange("zipCode", e.target.value)
                      }
                      disabled={!isEditing}
                      className={cn(isEditing && "ring-2 ring-blue-100")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.address.country}
                    onValueChange={(value) =>
                      handleAddressChange("country", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      className={cn(isEditing && "ring-2 ring-blue-100")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={handleSave}
                      className="gap-2 bg-gradient-to-r from-[#1890ff] to-[#722ed1]"
                    >
                      <Save className="h-4 w-4" />
                      Save Address
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Followed Shops Tab */}
          <TabsContent value="shops" className="space-y-6">
            <FollowedShops />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#1890ff]" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Email Newsletter</Label>
                        <p className="text-sm text-gray-600">
                          Weekly newsletter with best offers and deals
                        </p>
                      </div>
                      <Switch
                        checked={formData.preferences.newsletter}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("newsletter", checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Real-time alerts for new deals and updates
                        </p>
                      </div>
                      <Switch
                        checked={formData.preferences.notifications}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("notifications", checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">
                          Marketing Communications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Promotional offers and discount notifications
                        </p>
                      </div>
                      <Switch
                        checked={formData.preferences.marketing}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("marketing", checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Important updates via text message
                        </p>
                      </div>
                      <Switch
                        checked={formData.preferences.sms || false}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange("sms", checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="gap-2 bg-gradient-to-r from-[#1890ff] to-[#722ed1]"
                      >
                        <Save className="h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#1890ff]" />
                    Regional Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.preferences.language}
                        onValueChange={(value) =>
                          handlePreferencesChange("language", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          className={cn(isEditing && "ring-2 ring-blue-100")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                          <SelectItem value="de">🇩🇪 German</SelectItem>
                          <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                          <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.preferences.currency}
                        onValueChange={(value) =>
                          handlePreferencesChange("currency", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          className={cn(isEditing && "ring-2 ring-blue-100")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">
                            USD ($) - US Dollar
                          </SelectItem>
                          <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                          <SelectItem value="GBP">
                            GBP (£) - British Pound
                          </SelectItem>
                          <SelectItem value="CAD">
                            CAD (C$) - Canadian Dollar
                          </SelectItem>
                          <SelectItem value="AUD">
                            AUD (A$) - Australian Dollar
                          </SelectItem>
                          <SelectItem value="JPY">
                            JPY (¥) - Japanese Yen
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="UTC-8" disabled={!isEditing}>
                        <SelectTrigger
                          className={cn(isEditing && "ring-2 ring-blue-100")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">
                            Pacific Time (UTC-8)
                          </SelectItem>
                          <SelectItem value="UTC-5">
                            Eastern Time (UTC-5)
                          </SelectItem>
                          <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                          <SelectItem value="UTC+1">
                            Central European Time (UTC+1)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        className="gap-2 bg-gradient-to-r from-[#1890ff] to-[#722ed1]"
                      >
                        <Save className="h-4 w-4" />
                        Save Regional Settings
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings Navigation */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {[
                      {
                        id: "account",
                        label: "Account Security",
                        icon: Shield,
                      },
                      { id: "privacy", label: "Privacy", icon: Eye },
                      {
                        id: "devices",
                        label: "Connected Devices",
                        icon: Smartphone,
                      },
                      { id: "data", label: "Data & Storage", icon: Database },
                      {
                        id: "danger",
                        label: "Danger Zone",
                        icon: AlertTriangle,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSettingsTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                          activeSettingsTab === item.id
                            ? "bg-[#1890ff] text-white"
                            : "hover:bg-gray-100 text-gray-700",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Settings Content */}
              <div className="lg:col-span-3 space-y-6">
                {activeSettingsTab === "account" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#1890ff]" />
                        Account Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Password</h4>
                            <p className="text-sm text-gray-600">
                              Last changed 3 months ago
                            </p>
                          </div>
                          <Button variant="outline">Change Password</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-600">
                              Add an extra layer of security
                            </p>
                          </div>
                          <Button variant="outline">Enable 2FA</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Login Alerts</h4>
                            <p className="text-sm text-gray-600">
                              Get notified of new logins
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSettingsTab === "privacy" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-[#1890ff]" />
                        Privacy Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Profile Visibility</h4>
                            <p className="text-sm text-gray-600">
                              Who can see your profile information
                            </p>
                          </div>
                          <Select defaultValue="public">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">
                                Friends Only
                              </SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Activity Status</h4>
                            <p className="text-sm text-gray-600">
                              Show when you're online
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Data Collection</h4>
                            <p className="text-sm text-gray-600">
                              Allow analytics and improvement data
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSettingsTab === "devices" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-[#1890ff]" />
                        Connected Devices
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          device: "MacBook Pro",
                          location: "San Francisco, CA",
                          current: true,
                          icon: Laptop,
                        },
                        {
                          device: "iPhone 14",
                          location: "San Francisco, CA",
                          current: false,
                          icon: Smartphone,
                        },
                        {
                          device: "Chrome Browser",
                          location: "New York, NY",
                          current: false,
                          icon: Globe,
                        },
                      ].map((device, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <device.icon className="h-8 w-8 text-gray-400" />
                            <div>
                              <h4 className="font-medium">{device.device}</h4>
                              <p className="text-sm text-gray-600">
                                {device.location}
                              </p>
                              {device.current && (
                                <Badge className="text-xs">
                                  Current Device
                                </Badge>
                              )}
                            </div>
                          </div>
                          {!device.current && (
                            <Button variant="outline" size="sm">
                              Sign Out
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {activeSettingsTab === "data" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-[#1890ff]" />
                        Data & Storage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Download Your Data</h4>
                            <p className="text-sm text-gray-600">
                              Get a copy of all your data
                            </p>
                          </div>
                          <Button variant="outline" onClick={handleExportData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Storage Usage</h4>
                            <p className="text-sm text-gray-600">
                              2.3 GB of 5 GB used
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-[#1890ff] h-2 rounded-full w-[46%]"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Clear Cache</h4>
                            <p className="text-sm text-gray-600">
                              Remove temporary files and data
                            </p>
                          </div>
                          <Button variant="outline">Clear Cache</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSettingsTab === "danger" && (
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          These actions are irreversible. Please proceed with
                          caution.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-red-600">
                              Deactivate Account
                            </h4>
                            <p className="text-sm text-gray-600">
                              Temporarily disable your account
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600"
                          >
                            Deactivate
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-red-600">
                              Delete Account
                            </h4>
                            <p className="text-sm text-gray-600">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TicketSummary />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      FAQ
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Live Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-red-600 border-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
