"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Car, Loader2, Pencil, Trash2 } from "lucide-react";

import { vehicleApi } from "@/lib/api/vehicles";
import { getApiErrorMessage } from "@/lib/api/error";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const schema = z.object({
  registrationNumber: z.string().min(3, "Registration number is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
});

type FormData = z.infer<typeof schema>;

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [serverError, setServerError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!id) return;

    vehicleApi
      .getById(id)
      .then((data) => {
        setVehicle(data);
        reset(data);
      })
      .catch(() => setError(true));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setServerError("");
      const updated = await vehicleApi.update(id, data);
      setVehicle(updated);
      setEditing(false);
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, "Unable to update vehicle."));
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await vehicleApi.delete(id);
      router.push("/customer/vehicles");
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, "Unable to delete vehicle."));
      setDeleting(false);
    }
  };

  if (error) {
    return <ErrorState />;
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="glow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{vehicle.registrationNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>

          {!editing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  }
                />

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Any claims linked to this
                      vehicle will keep referencing it by ID.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {serverError && (
            <p className="mb-4 text-sm text-destructive">{serverError}</p>
          )}

          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input id="registrationNumber" {...register("registrationNumber")} />
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select
                  defaultValue={vehicle.vehicleType}
                  onValueChange={(value) => setValue("vehicleType", String(value))}
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
                  <p className="text-sm text-destructive">{errors.vehicleType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" {...register("make")} />
                {errors.make && (
                  <p className="text-sm text-destructive">{errors.make.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" {...register("model")} />
                {errors.model && (
                  <p className="text-sm text-destructive">{errors.model.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    reset(vehicle);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Registration Number" value={vehicle.registrationNumber} />
              <Field label="Vehicle Type" value={vehicle.vehicleType} />
              <Field label="Make" value={vehicle.make} />
              <Field label="Model" value={vehicle.model} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
