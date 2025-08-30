import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, User, Bell, Shield, LogOut, Trash2, Save, Chrome } from 'lucide-react';

export default function Settings() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    browserNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    eventReminders: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    
    setIsSubmitting(false);
  };

  const handleDeleteAccount = async () => {
    // This would typically involve calling a backend endpoint
    // For now, we'll just show a toast
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete account deletion.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <SettingsIcon className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Account Information */}
            <Card className="glass-strong animate-slide-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-foreground">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                    <p className="text-foreground capitalize">
                      {profile?.role?.replace('_', ' ') || 'Member'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                    <p className="text-foreground">
                      {new Date(profile?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="glass-strong animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notifications" className="text-base">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show push notifications in your browser</p>
                    </div>
                    <Switch
                      id="browser-notifications"
                      checked={preferences.browserNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('browserNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails" className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional and marketing content</p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-digest" className="text-base">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Get a weekly summary of activities</p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={preferences.weeklyDigest}
                      onCheckedChange={(checked) => handlePreferenceChange('weeklyDigest', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="event-reminders" className="text-base">Event Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming events</p>
                    </div>
                    <Switch
                      id="event-reminders"
                      checked={preferences.eventReminders}
                      onCheckedChange={(checked) => handlePreferenceChange('eventReminders', checked)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={isSubmitting}
                  className="bg-gradient-primary hover:shadow-green"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card className="glass-strong animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="w-5 h-5" />
                  Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Chrome className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Google</p>
                      <p className="text-sm text-muted-foreground">Connected via OAuth</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card className="glass-strong animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="w-full justify-start text-left hover:bg-destructive/5 hover:border-destructive/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>

                  <Separator />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left text-destructive hover:bg-destructive/5 hover:border-destructive/20"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}