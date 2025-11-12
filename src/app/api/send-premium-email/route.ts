import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, timestamp } = await request.json();

    // Aqui você pode integrar com serviços de email como:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // Por enquanto, vamos simular o envio

    const emailContent = {
      to: 'rai.marques.souza@escola.pr.gov.br',
      subject: '🎯 Nova Solicitação Premium - Slim90',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
            .label { font-weight: bold; color: #ea580c; }
            .value { color: #374151; margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Slim90 Premium</h1>
              <p>Nova Solicitação de Upgrade</p>
            </div>
            <div class="content">
              <h2>Dados do Usuário:</h2>
              <div class="info-box">
                <p><span class="label">Nome:</span><span class="value">${name}</span></p>
                <p><span class="label">Email:</span><span class="value">${email}</span></p>
                <p><span class="label">Telefone:</span><span class="value">${phone}</span></p>
                <p><span class="label">Data/Hora:</span><span class="value">${new Date(timestamp).toLocaleString('pt-BR')}</span></p>
              </div>
              <p style="margin-top: 20px; color: #6b7280;">
                Este usuário solicitou upgrade para o plano Premium do Slim90.
                Entre em contato para finalizar o processo de pagamento.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Log para desenvolvimento (em produção, integre com serviço de email real)
    console.log('📧 Email que seria enviado:', emailContent);

    // Simula sucesso
    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado com sucesso',
      data: emailContent 
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao enviar email' },
      { status: 500 }
    );
  }
}
