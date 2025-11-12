'use client';

import { useState } from 'react';
import { X, Crown, Check, CreditCard } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  userPhone: string;
}

export default function PremiumModal({ isOpen, onClose, userEmail, userName, userPhone }: PremiumModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setShowPayment(true);
  };

  const handlePayment = async () => {
    // Validação básica
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
      alert('Por favor, preencha todos os dados do cartão');
      return;
    }

    setLoading(true);
    
    try {
      // Envia email com dados do usuário e confirmação de pagamento
      const response = await fetch('/api/send-premium-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          phone: userPhone,
          timestamp: new Date().toISOString(),
          paymentInfo: {
            cardLast4: paymentData.cardNumber.slice(-4),
            cardName: paymentData.cardName
          }
        })
      });

      if (response.ok) {
        setSuccess(true);
        
        // Atualiza usuário para premium
        const userData = localStorage.getItem('slim90_user');
        if (userData) {
          const user = JSON.parse(userData);
          user.isPremium = true;
          localStorage.setItem('slim90_user', JSON.stringify(user));
        }

        // Reseta contador de receitas
        localStorage.setItem('slim90_clicked_recipes', '0');

        // Fecha modal após 3 segundos e recarrega página
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 dígitos + 3 espaços
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        {/* Botão X desabilitado se não for premium */}
        {success && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h3>
            <p className="text-gray-600 mb-4">
              Bem-vindo ao Slim90 Premium! 🎉
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando...
            </p>
          </div>
        ) : showPayment ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Finalizar Pagamento
              </h2>
              <p className="text-gray-600">
                Preencha os dados do cartão
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    cardNumber: formatCardNumber(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  placeholder="NOME COMPLETO"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    cardName: e.target.value.toUpperCase()
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      expiryDate: formatExpiryDate(e.target.value)
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Plano Premium</span>
                <span className="font-bold text-gray-900">R$ 47,90/mês</span>
              </div>
              <div className="text-xs text-gray-500">
                Cobrança mensal • Cancele quando quiser
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : 'Confirmar Pagamento'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Pagamento seguro e criptografado
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Upgrade para Premium
              </h2>
              <p className="text-gray-600">
                Você atingiu o limite de receitas gratuitas
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Benefícios Premium:</h3>
              <ul className="space-y-3">
                {[
                  'Acesso ilimitado a todas as 1000+ receitas',
                  'Plano de dieta personalizado de 90 dias',
                  'Calculadora de calorias avançada',
                  'Lista de compras automática',
                  'Suporte prioritário',
                  'Receitas exclusivas semanais'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                R$ 47,90
                <span className="text-lg text-gray-500 font-normal">/mês</span>
              </div>
              <p className="text-sm text-gray-500">Cancele quando quiser</p>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continuar para Pagamento
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao continuar, você será direcionado para o checkout seguro
            </p>
          </>
        )}
      </div>
    </div>
  );
}
