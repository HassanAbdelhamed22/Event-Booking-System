const Error = ({ error }: { error: string }) => {
  return (
    <div className="bg-error-50 text-error-700 p-4 rounded-md text-center">
      {error}
    </div>
  );
};

export default Error;
