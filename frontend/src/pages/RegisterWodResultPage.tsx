import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";

import { getMyWods } from "../api/wodsApi";
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
  wodId: "",
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

  const [wods, setWods] = useState<WodAggregateResponse[]>([]);
  const [values, setValues] = useState<WodResultFormValues>(initialValues);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWod =
    wods.find((wod) => wod.id === Number(values.wodId)) ?? null;

  useEffect(() => {
    let active = true;

    getMyWods()
      .then((data) => {
        if (active) {
          setWods(data);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar tus WODs");
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
  }, []);

  function handleChange(
    field: keyof WodResultFormValues,
    value: string | boolean,
  ) {
    if (field === "wodId") {
      setValues({
        ...initialValues,
        performedAt: values.performedAt,
        wodId: String(value),
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
    } catch {
      setError("No se pudo guardar el resultado del WOD");
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
