const TestPage = () => {
  return (
    <div className="h-screen w-screen bg-white">
      <div className="flex p-8">
        <div className="flex gap-4">
          <p>Värit</p>
          <div className="bg-bgPrimary p-8 text-lg border border-borderPrimary">
            <p>bgPrimary</p>
          </div>
          <div className="bg-bgSecondary p-8 text-lg border border-borderPrimary">
            <p>bgSecondary</p>
          </div>
          <div className="bg-primaryColor p-8 text-lg border border-borderPrimary">
            <p>primaryColor</p>
          </div>
          <div className="bg-secondaryColor p-8 text-lg border border-borderPrimary">
            <p>secondaryColor</p>
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
