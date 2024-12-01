import { parseISO, format } from 'date-fns';

interface FormattedDateProps {
  dateString: string;
}

export function FormattedDate({ dateString }: FormattedDateProps) {
  const date = parseISO(dateString);
  const formattedDate = format(date, "MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="flex text-lg font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-md justify-center items-center">
      {formattedDate}
    </div>
  );
}

