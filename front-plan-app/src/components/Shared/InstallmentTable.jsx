import React from 'react';

const InstallmentTable = ({ installments, onPay = null }) => {
  return (
    <div className="table-responsive mt-4">
      <table className="table align-middle table-hover table-bordered shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            {onPay && <th className="text-center">Action</th>}
          </tr>
        </thead>
        <tbody>
          {installments.map((installment) => {
            let rowClass = '';
            if (installment.status === 'Not Paid and Late') rowClass = 'table-danger';
            else if (installment.status.toLowerCase().includes('paid')) rowClass = 'table-success';

            const isPayable = installment.status !== 'Paid On Time' & installment.status !== 'Paid Late' & installment.status !== 'Paid Early';

            return (
              <tr key={installment.id} className={rowClass}>
                <td>{installment.due_date}</td>
                <td>{installment.amount} ريال</td>
                <td>
                  <span
                    className={`badge ${
                      installment.status.toLowerCase().includes('paid') ? 'bg-success' :
                      installment.status.toLowerCase().includes('late') ? 'bg-danger' :
                      'bg-secondary'
                    }`}
                  >
                    {installment.status}
                  </span>
                </td>
                {onPay && (
                  <td className="text-center">
                    {isPayable ? (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => onPay(installment.id)}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-muted small">Paid</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InstallmentTable;
