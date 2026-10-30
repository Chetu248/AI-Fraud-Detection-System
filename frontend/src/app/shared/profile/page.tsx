"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, UserCircle } from "lucide-react";

import { userApi } from "@/lib/api/users";

import type {
  UserProfileRequest,
} from "@/types/user";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyProfile: UserProfileRequest = {
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UserProfileRequest>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response =
          await userApi.getProfile();

        setProfile({
          dateOfBirth:
            response.dateOfBirth ?? "",
          address: response.address ?? "",
          city: response.city ?? "",
          state: response.state ?? "",
          pincode: response.pincode ?? "",
        });
      } catch {
        setMessage("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    field: keyof UserProfileRequest,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await userApi.updateProfile(profile);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCircle className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your personal information.
            </p>
          </div>
        </div>
      </div>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Keep your profile details up to date.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth
                </Label>

                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth ?? ""}
                  onChange={(event) =>
                    handleChange(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">
                  Pincode
                </Label>

                <Input
                  id="pincode"
                  value={profile.pincode ?? ""}
                  placeholder="Enter pincode"
                  onChange={(event) =>
                    handleChange(
                      "pincode",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address
              </Label>

              <Input
                id="address"
                value={profile.address ?? ""}
                placeholder="Enter your address"
                onChange={(event) =>
                  handleChange(
                    "address",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City
                </Label>

                <Input
                  id="city"
                  value={profile.city ?? ""}
                  placeholder="Enter city"
                  onChange={(event) =>
                    handleChange(
                      "city",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State
                </Label>

                <Input
                  id="state"
                  value={profile.state ?? ""}
                  placeholder="Enter state"
                  onChange={(event) =>
                    handleChange(
                      "state",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {message && (
              <div className="rounded-lg border bg-muted/50 px-4 py-3 text-sm">
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
