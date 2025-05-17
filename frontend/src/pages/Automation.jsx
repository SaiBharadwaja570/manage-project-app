import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AutomationCard from '../components/automation/AutomationCard';
import AutomationForm from '../components/automation/AutomationForm';
import { getAutomationsByProject, deleteAutomation } from '../services/api';
import Modal from '../components/ui/Modal';

export default function AutomationPage() {
  const { projectId } = useParams();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const data = await getAutomationsByProject(projectId);
        setAutomations(data);
      } catch (error) {
        console.error('Error fetching automations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutomations();
  }, [projectId]);

  const handleDelete = async (automationId) => {
    try {
      await deleteAutomation(automationId);
      setAutomations(automations.filter(auto => auto._id !== automationId));
    } catch (error) {
      console.error('Error deleting automation:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading automations...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Automation Rules</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          New Rule
        </button>
      </div>

      <div className="space-y-4">
        {automations.length === 0 ? (
          <p className="text-gray-500">No automation rules yet</p>
        ) : (
          automations.map(auto => (
            <AutomationCard 
              key={auto._id} 
              automation={auto} 
              onDelete={() => handleDelete(auto._id)}
            />
          ))
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <AutomationForm 
          projectId={projectId}
          onSuccess={() => {
            setShowForm(false);
            getAutomationsByProject(projectId).then(setAutomations);
          }} 
        />
      </Modal>
    </div>
  );
}