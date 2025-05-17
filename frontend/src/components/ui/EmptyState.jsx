import { Link } from "react-router-dom";

const EmptyState = ({ title, description, actionText, actionLink }) => (
    <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-dashed border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-6">
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText}
        </Link>
      </div>
    </div>
  );
  
  export default EmptyState;