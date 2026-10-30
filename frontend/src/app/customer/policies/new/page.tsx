"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { policyApi } from "@/lib/api/policies";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  policyNumber: z.string().min(3),
  policyType: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  premiumAmount: z.coerce.number().positive(),
  status: z.string().min(1),
  vehicleId: z.string().min(1),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export default function NewPolicyPage() {
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
      const policy = await policyApi.create({
        policyNumber: data.policyNumber,
        policyType: data.policyType,
        startDate: data.startDate,
        endDate: data.endDate,
        premiumAmount: data.premiumAmount,
        status: data.status,
        vehicleId: Number(data.vehicleId),
      });

      router.push(`/customer/policies/${policy.id}`);
    } catch (error: unknown) {
      setServerError(getApiErrorMessage(error, "Unable to create policy."));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Add Policy
        </h1>
      </div>

      <Card className="glow-card">
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Policy Number</Label>
              <Input {...register("policyNumber")} />
              {errors.policyNumber && (
                <p className="text-sm text-destructive">
                  Policy number is required.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Policy Type</Label>

              <Select
                onValueChange={(value) =>
                  setValue("policyType", String(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="COMPREHENSIVE">
                    Comprehensive
                  </SelectItem>
                  <SelectItem value="THIRD_PARTY">
                    Third Party
                  </SelectItem>
                  <SelectItem value="OWN_DAMAGE">
                    Own Damage
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  {...register("startDate")}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register("endDate")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Premium Amount</Label>
              <Input
                type="number"
                {...register("premiumAmount")}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>

              <Select
                defaultValue="ACTIVE"
                onValueChange={(value) =>
                  setValue("status", String(value ?? ""))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Active
                  </SelectItem>
                  <SelectItem value="EXPIRED">
                    Expired
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {serverError && (
              <p className="text-sm text-destructive">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting
                ? "Creating..."
                : "Create Policy"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}