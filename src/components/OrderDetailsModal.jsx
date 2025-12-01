import React from 'react';
import { X, MapPin, Phone, Clock, CreditCard, Receipt, User } from 'lucide-react';
import { safeJSONParse } from '../utils/helpers';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const items = safeJSONParse(order.items, []);
    const customerInfo = safeJSONParse(order.customer_info, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-mitake-black border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-mitake-gold">
                            Commande #{order.order_number?.slice(-4) || '????'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {new Date(order.created_at).toLocaleString('fr-FR')}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Status & Type */}
                    <div className="flex flex-wrap gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${order.status === 'ready' ? 'bg-green-500 text-black' :
                                order.status === 'delivering' ? 'bg-blue-500 text-white' :
                                    order.status === 'completed' ? 'bg-gray-500 text-white' :
                                        'bg-yellow-500 text-black'
                            }`}>
                            {order.status === 'pending_print' ? 'En attente' :
                                order.status === 'printed' ? 'En cuisine' :
                                    order.status === 'ready' ? 'Prêt' :
                                        order.status === 'delivering' ? 'En livraison' : order.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-bold uppercase bg-white/10 text-white border border-white/10">
                            {order.type === 'dine_in' ? 'Sur Place' :
                                order.type === 'takeaway' ? 'À Emporter' : 'Livraison'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-bold uppercase bg-white/10 text-white border border-white/10 flex items-center gap-2">
                            <CreditCard size={14} />
                            {order.payment_method === 'card' ? 'Carte Bancaire' :
                                order.payment_method === 'cash' ? 'Espèces' : 'Comptoir'}
                        </span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-200">
                            <User size={18} className="text-mitake-gold" />
                            Client
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400">Nom</p>
                                <p className="font-medium text-lg">{customerInfo.name || 'Anonyme'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Téléphone</p>
                                <p className="font-mono">{customerInfo.phone || '-'}</p>
                            </div>
                            {order.type === 'delivery' && (
                                <div className="md:col-span-2">
                                    <p className="text-gray-400 flex items-center gap-1">
                                        <MapPin size={14} /> Adresse
                                    </p>
                                    <p className="font-medium">{customerInfo.address || 'Non renseignée'}</p>
                                </div>
                            )}
                            {customerInfo.notes && (
                                <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 p-3 rounded text-red-200">
                                    <p className="font-bold text-xs uppercase mb-1 text-red-400">Note Client</p>
                                    {customerInfo.notes}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-200 mb-3">
                            <Receipt size={18} className="text-mitake-gold" />
                            Détails de la commande
                        </h3>
                        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black/20 text-gray-400 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="p-3">Qté</th>
                                        <th className="p-3">Article</th>
                                        <th className="p-3 text-right">Prix</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 font-bold text-mitake-gold w-12 text-center">{item.quantity}x</td>
                                            <td className="p-3">
                                                <p className="font-bold">{item.name}</p>
                                                {item.options && item.options.length > 0 && (
                                                    <div className="text-gray-400 text-xs mt-1">
                                                        {item.options.map(o => `+ ${o.name}`).join(', ')}
                                                    </div>
                                                )}
                                                {item.comment && (
                                                    <p className="text-red-400 text-xs mt-1 italic">Note: {item.comment}</p>
                                                )}
                                            </td>
                                            <td className="p-3 text-right font-mono">
                                                {((item.price || 0) * item.quantity).toFixed(2)}€
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-mitake-gold/10 font-bold text-lg">
                                    <tr>
                                        <td colSpan="2" className="p-4 text-right text-mitake-gold">TOTAL</td>
                                        <td className="p-4 text-right text-white">{order.total_price}€</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
