"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Eye, Plus } from "lucide-react";

import { vehicleApi } from "@/lib/api/vehicles";
import type { VehicleResponse } from "@/types/vehicle";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleResponse[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function load() {
      setError(false);

      try {
        setVehicles(await vehicleApi.getAll());
      } catch {
        setError(true);
      }
    }

    load();
  }, [reloadToken]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Manage your registered vehicles."
        actions={
          <Button asChild>
            <Link href="/customer/vehicles/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState onRetry={() => setReloadToken((t) => t + 1)} />
      ) : !vehicles ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No Vehicles Yet"
          description="Add a vehicle before submitting a claim against it."
          actionLabel="Add Your First Vehicle"
          actionHref="/customer/vehicles/new"
        />
      ) : (
        <>
          <Card className="glow-card hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        {vehicle.registrationNumber}
                      </TableCell>
                      <TableCell>{vehicle.vehicleType}</TableCell>
                      <TableCell>{vehicle.make}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/customer/vehicles/${vehicle.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-3 md:hidden">
            {vehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/customer/vehicles/${vehicle.id}`}>
                <Card className="glow-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="font-medium">{vehicle.registrationNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.make} {vehicle.model} · {vehicle.vehicleType}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
