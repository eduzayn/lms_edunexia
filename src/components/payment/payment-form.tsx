"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  courseId: string;
  courseTitle: string;
  price: number;
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
}

export function PaymentForm({ courseId, courseTitle, price, onSuccess, onCancel }: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          courseId,
          paymentMethod,
          amount: price,
          description: `Matrícula no curso: ${courseTitle}`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao processar pagamento");
      }
      
      const data = await response.json();
      
      if (data.checkout_url) {
        // Redirect to InfinityPay checkout page
        window.location.href = data.checkout_url;
      } else if (data.payment && onSuccess) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.payment.id);
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError((error as Error).message || "Falha ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">Pagamento</CardTitle>
        <CardDescription>Complete o pagamento para se matricular no curso</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Sucesso</AlertTitle>
            <AlertDescription className="text-green-600">
              Pagamento processado com sucesso! Redirecionando...
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="course">Curso</Label>
              <Input id="course" value={courseTitle} disabled />
            </div>
            
            <div>
              <Label htmlFor="price">Valor</Label>
              <Input 
                id="price" 
                value={`R$ ${price.toFixed(2)}`} 
                disabled 
              />
            </div>
            
            <div>
              <Label htmlFor="payment-method">Método de Pagamento</Label>
              <div className="relative">
                <Select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="pix">PIX</option>
                </Select>
              </div>
            </div>
            
            {paymentMethod === "credit_card" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Você será redirecionado para a página segura de pagamento do InfinityPay para completar a transação.
                </p>
              </div>
            )}
            
            {paymentMethod === "boleto" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Um boleto será gerado após o processamento. O acesso ao curso será liberado após a confirmação do pagamento.
                </p>
              </div>
            )}
            
            {paymentMethod === "pix" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Um QR Code PIX será gerado para pagamento imediato. O acesso ao curso será liberado automaticamente após a confirmação.
                </p>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading || success}>
          {loading ? "Processando..." : "Finalizar Pagamento"}
        </Button>
      </CardFooter>
    </Card>
  );
}
