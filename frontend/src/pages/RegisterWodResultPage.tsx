import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import type { FormEvent } from "react";

import {
  getAvailableWodVersionItems,
  getAvailableWodVersions,
  getAvailableWods,
} from "../api/wodsApi";
import { createWodResult } from "../api/wodsResultsApi";

import type { WodAggregateResponse } from "../types/Wod";
import type { WodResultRequest } from "../types/WodResult";

import RegisterWodResultView from "../views/wod-results/RegisterWodResultView";
import type { WodResultFormValues } from "../views/wod-results/RegisterWodResultView.Types";

function getLocalDateTime(): string {
  const now = new Date();

  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  return localTime.toISOString().slice(0, 16);
}

const initialValues: WodResultFormValues = {
  wodVersionId: "",
  performedAt: getLocalDateTime(),
  completed: true,
  timeSeconds: "",
  progressRounds: "",
  progressItemId: "",
  progressReps: "",
  progressDistanceM: "",
  progressDurationSeconds: "",
  amrapRounds: "",
  amrapExtraReps: "",
};

function optionalNumber(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}

function RegisterWodResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedWodId = searchParams.get("wodId");

  const [wods, setWods] = useState<WodAggregateResponse[]>([]);
  const [values, setValues] = useState<WodResultFormValues>(initialValues);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWod =
    wods.find((wod) => wod.version.id === Number(values.wodVersionId)) ?? null;

  useEffect(() => {
    let active = true;

    Promise.all([
      getAvailableWods(),
      getAvailableWodVersions(),
      getAvailableWodVersionItems(),
    ])
      .then(([availableWods, versions, versionItems]) => {
        const selectableWods = versions
          .map((version) => {
            const wod = availableWods.find((item) => item.id === version.wodId);

            if (!wod) {
              return null;
            }

            return {
              ...wod,
              version,
              composition: versionItems.filter(
                (item) => item.wodVersionId === version.id,
              ),
            };
          })
          .filter((wod): wod is WodAggregateResponse => wod !== null)
          .sort((first, second) =>
            `${first.name}-${first.version.versionNumber}`.localeCompare(
              `${second.name}-${second.version.versionNumber}`,
            ),
          );

        if (active) {
          setWods(selectableWods);

          if (requestedWodId !== null) {
            const requestedWod = selectableWods
              .filter((wod) => wod.id === Number(requestedWodId))
              .sort(
                (first, second) =>
                  second.version.versionNumber - first.version.versionNumber,
              )[0];

            if (requestedWod) {
              setValues((current) =>
                current.wodVersionId
                  ? current
                  : { ...current, wodVersionId: String(requestedWod.version.id) },
              );
            }
          }
        }
      })
      .catch((cause) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "No se pudieron cargar tus WODs y sus versiones",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [requestedWodId]);

  function handleChange(
    field: keyof WodResultFormValues,
    value: string | boolean,
  ) {
    if (field === "wodVersionId") {
      setValues({
        ...initialValues,
        performedAt: values.performedAt,
        wodVersionId: String(value),
      });

      return;
    }

    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedWod || saving) {
      return;
    }

    setError(null);

    const request: WodResultRequest = {
      wodVersionId: selectedWod.version.id,
      performedAt: values.performedAt,
    };

    const type = selectedWod.version.type;

    if (type === "AMRAP") {
      if (values.amrapRounds === "" || values.amrapExtraReps === "") {
        setError("Indica las rondas y repeticiones del AMRAP");
        return;
      }

      request.amrapRounds = Number(values.amrapRounds);
      request.amrapExtraReps = Number(values.amrapExtraReps);
    }

    if (type === "FOR_TIME") {
      request.completed = values.completed;

      if (values.completed) {
        if (values.timeSeconds === "" || Number(values.timeSeconds) <= 0) {
          setError("Indica un tiempo válido");
          return;
        }

        request.timeSeconds = Number(values.timeSeconds);
      } else {
        if (values.progressRounds === "" || values.progressItemId === "") {
          setError("Indica las rondas completadas y el ejercicio alcanzado");
          return;
        }

        request.progressRounds = Number(values.progressRounds);
        request.progressItemId = Number(values.progressItemId);

        request.progressReps = optionalNumber(values.progressReps);

        request.progressDistanceM = optionalNumber(values.progressDistanceM);

        request.progressDurationSeconds = optionalNumber(
          values.progressDurationSeconds,
        );

        const hasProgress =
          request.progressReps !== undefined ||
          request.progressDistanceM !== undefined ||
          request.progressDurationSeconds !== undefined;

        if (!hasProgress) {
          setError("Indica la cantidad realizada en el ejercicio alcanzado");
          return;
        }
      }
    }

    if (type === "EMOM") {
      request.completed = values.completed;
    }

    try {
      setSaving(true);

      await createWodResult(request);

      navigate("/my-wod-results", {
        replace: true,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo guardar el resultado del WOD",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <RegisterWodResultView
      wods={wods}
      selectedWod={selectedWod}
      values={values}
      loading={loading}
      saving={saving}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

export default RegisterWodResultPage;
