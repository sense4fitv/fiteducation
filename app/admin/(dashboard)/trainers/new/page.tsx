import TrainerForm from "@/components/admin/TrainerForm";

export default function NewTrainerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add Trainer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new trainer profile
        </p>
      </div>
      <TrainerForm />
    </div>
  );
}
