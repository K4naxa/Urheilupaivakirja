const TestPage = () => {
  return (
    <div className="h-screen w-screen bg-white">
      <div className="flex p-8">
        <div className="flex gap-4">
          <p>Värit</p>
          <div className="bg-bgkPrimary p-8 text-lg border border-borderPrimary">
            <p>bgkPrimary</p>
          </div>
          <div className="bg-bgkSecondary p-8 text-lg border border-borderPrimary">
            <p>bgkSecondary</p>
          </div>
          <div className="bg-headerPrimary p-8 text-lg border border-borderPrimary">
            <p>headerPrimary</p>
          </div>
          <div className="bg-headerSecondary p-8 text-lg border border-borderPrimary">
            <p>headerSecondary</p>
          </div>
          <div className="bg-textPrimary p-8 text-lg border border-borderPrimary">
            <p>textPrimary</p>
          </div>
          <div className="bg-textSecondary p-8 text-lg border border-borderPrimary">
            <p>textSecondary</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
