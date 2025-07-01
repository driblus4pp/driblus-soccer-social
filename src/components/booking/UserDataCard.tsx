
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserData {
  name: string;
  phone: string;
  email: string;
}

interface UserDataCardProps {
  userData: UserData;
}

const UserDataCard = ({ userData }: UserDataCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Dados do Responsável</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-white">
          <p><strong>Nome:</strong> {userData.name}</p>
          <p><strong>Telefone:</strong> {userData.phone}</p>
          <p><strong>E-mail:</strong> {userData.email}</p>
        </div>
        <p className="text-white/70 text-sm mt-2">
          * Dados obtidos automaticamente do seu perfil
        </p>
      </CardContent>
    </Card>
  );
};

export default UserDataCard;
