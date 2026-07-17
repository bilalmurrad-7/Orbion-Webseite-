import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Finances() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newIncome, setNewIncome] = useState({ description: '', amount: '' });
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = () => {
    const storedIncome = localStorage.getItem('finances_income');
    const storedExpenses = localStorage.getItem('finances_expenses');
    if (storedIncome) setIncome(JSON.parse(storedIncome));
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
  };

  const getMonthStart = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const getMonthEnd = () => {
    return new Date();
  };

  const isInCurrentMonth = (dateString) => {
    const date = new Date(dateString);
    const start = getMonthStart();
    const end = getMonthEnd();
    return date >= start && date <= end;
  };

  const currentMonthIncome = income.filter(i => isInCurrentMonth(i.date)).reduce((sum, i) => sum + parseFloat(i.amount), 0);
  const currentMonthExpenses = expenses.filter(e => isInCurrentMonth(e.date)).reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const netProfit = currentMonthIncome - currentMonthExpenses;

  const handleAddIncome = () => {
    if (newIncome.description && newIncome.amount) {
      const entry = {
        ...newIncome,
        amount: parseFloat(newIncome.amount),
        date: new Date().toISOString().split('T')[0],
      };
      const updated = [...income, entry];
      setIncome(updated);
      localStorage.setItem('finances_income', JSON.stringify(updated));
      setNewIncome({ description: '', amount: '' });
    }
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const entry = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0],
      };
      const updated = [...expenses, entry];
      setExpenses(updated);
      localStorage.setItem('finances_expenses', JSON.stringify(updated));
      setNewExpense({ description: '', amount: '' });
    }
  };

  const handleRemoveIncome = (index) => {
    const updated = income.filter((_, i) => i !== index);
    setIncome(updated);
    localStorage.setItem('finances_income', JSON.stringify(updated));
  };

  const handleRemoveExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
    localStorage.setItem('finances_expenses', JSON.stringify(updated));
  };

  const chartData = [
    { name: 'Diesen Monat', Einnahmen: currentMonthIncome, Ausgaben: currentMonthExpenses },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Einnahmen (diese Monat)</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{currentMonthIncome.toFixed(2)}€</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Ausgaben (diese Monat)</div>
          <div className="text-3xl font-bold text-red-400 mt-2">{currentMonthExpenses.toFixed(2)}€</div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Netto-Gewinn</div>
          <div className={`text-3xl font-bold mt-2 ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {netProfit.toFixed(2)}€
          </div>
        </div>
        <div className="glass-card">
          <div className="text-gray-400 text-sm">Gewinnmarge</div>
          <div className="text-3xl font-bold text-blue-400 mt-2">
            {currentMonthIncome > 0 ? ((netProfit / currentMonthIncome) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card h-80">
        <h3 className="text-lg font-semibold text-white mb-4">Einnahmen vs Ausgaben</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="Einnahmen" fill="#22c55e" />
            <Bar dataKey="Ausgaben" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="space-y-4">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Einnahmen hinzufügen</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Beschreibung"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <input
                type="number"
                placeholder="Betrag (€)"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <button onClick={handleAddIncome} className="glass-button w-full">
                Hinzufügen
              </button>
            </div>
          </div>

          {/* Income List */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Einnahmen</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {income.length === 0 ? (
                <p className="text-gray-400">Keine Einnahmen hinzugefügt</p>
              ) : (
                income.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex-1">
                      <p className="font-medium text-white">{entry.description}</p>
                      <p className="text-sm text-gray-400">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-green-400 font-semibold">{entry.amount.toFixed(2)}€</p>
                      <button
                        onClick={() => handleRemoveIncome(idx)}
                        className="px-2 py-1 text-red-400 hover:bg-red-500/10 rounded transition text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Expense Section */}
        <div className="space-y-4">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Ausgaben hinzufügen</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Beschreibung"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <input
                type="number"
                placeholder="Betrag (€)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <button onClick={handleAddExpense} className="glass-button w-full">
                Hinzufügen
              </button>
            </div>
          </div>

          {/* Expense List */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Ausgaben</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-gray-400">Keine Ausgaben hinzugefügt</p>
              ) : (
                expenses.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex-1">
                      <p className="font-medium text-white">{entry.description}</p>
                      <p className="text-sm text-gray-400">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-red-400 font-semibold">{entry.amount.toFixed(2)}€</p>
                      <button
                        onClick={() => handleRemoveExpense(idx)}
                        className="px-2 py-1 text-red-400 hover:bg-red-500/10 rounded transition text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finances;
