"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { vehicleApi } from "@/lib/api/vehicles";
import { getApiErrorMessage } from "@/lib/api/error";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  registrationNumber: z
    .string()
    .min(3, "Registration number is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
});

type FormData = z.infer<typeof schema>;

export default function NewVehiclePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setServerError("");

      const vehicle = await vehicleApi.create(data);

      router.push(`/customer/vehicles/${vehicle.id}`);
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Unable to create vehicle."));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Vehicle</h1>
        <p className="text-muted-foreground">
          Register a vehicle to your insurance account.
        </p>
      </div>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">
                Registration Number
              </Label>

              <Input
                id="registrationNumber"
                placeholder="RJ14AB1234"
                {...register("registrationNumber")}
              />

              {errors.registrationNumber && (
                <p className="text-sm text-destructive">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Vehicle Type</Label>

              <Select
                onValueChange={(value) =>
                  setValue("vehicleType", String(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CAR">Car</SelectItem>
                  <SelectItem value="BIKE">Bike</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                  <SelectItem value="BUS">Bus</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              {errors.vehicleType && (
                <p className="text-sm text-destructive">
                  {errors.vehicleType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>

              <Input
                id="make"
                placeholder="Toyota"
                {...register("make")}
              />

              {errors.make && (
                <p className="text-sm text-destructive">
                  {errors.make.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>

              <Input
                id="model"
                placeholder="Fortuner"
                {...register("model")}
              />

              {errors.model && (
                <p className="text-sm text-destructive">
                  {errors.model.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive">
                {serverError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Vehicle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}