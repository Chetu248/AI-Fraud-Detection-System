"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { claimApi } from "@/lib/api/claims";
import { getApiErrorMessage } from "@/lib/api/error";
import { vehicleApi } from "@/lib/api/vehicles";
import type { VehicleResponse } from "@/types/vehicle";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const schema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  claimAmount: z.coerce
    .number()
    .positive("Claim amount must be positive"),
  description: z.string().min(10, "Description is required"),
  claimDate: z.string().min(1, "Claim date is required"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export default function NewClaimPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, undefined, FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    vehicleApi.getAll().then(setVehicles).catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setServerError("");

      const claim = await claimApi.create({
        vehicleId: Number(data.vehicleId),
        claimAmount: data.claimAmount,
        description: data.description,
        claimDate: data.claimDate,
      });

      router.push(`/customer/claims/${claim.id}`);
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Unable to create claim."));
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Submit Claim
        </h1>
        <p className="text-muted-foreground">
          Submit a new insurance claim for review.
        </p>
      </div>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label>Vehicle</Label>

              <Select
                onValueChange={(value) =>
                  setValue("vehicleId", String(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>

                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem
                      key={vehicle.id}
                      value={String(vehicle.id)}
                    >
                      {vehicle.registrationNumber} —{" "}
                      {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.vehicleId && (
                <p className="text-sm text-destructive">
                  {errors.vehicleId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimAmount">
                Claim Amount
              </Label>

              <Input
                id="claimAmount"
                type="number"
                placeholder="50000"
                {...register("claimAmount")}
              />

              {errors.claimAmount && (
                <p className="text-sm text-destructive">
                  {errors.claimAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimDate">
                Claim Date
              </Label>

              <Input
                id="claimDate"
                type="date"
                {...register("claimDate")}
              />

              {errors.claimDate && (
                <p className="text-sm text-destructive">
                  {errors.claimDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                placeholder="Describe the incident..."
                rows={6}
                {...register("description")}
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
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
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Claim"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}