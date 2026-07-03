import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <Card className="w-full justify-center">
        <div className=" w-full flex">
          <div className="w-2/4 flex flex-col gap-5">
            <CardContent>
              <CardTitle className="text-xl font-bold">
                Welcome to ClassHub Academic Workspace!
              </CardTitle>
              <CardDescription className="text-gray-600">
                Let's get started by joining or creating your first
                organization. Organizations are your classes or colleges. Posts
                inside them will be visible to all members.
              </CardDescription>
            </CardContent>
            <CardContent>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-blue-500" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Card className="border-l-4 border-blue-500 rounded-sm py-3.5 mb-3 hover:bg-blue-50 transition-colors duration-100">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Create or Join an Organization
                      </CardTitle>
                      <CardDescription className="text-xs">
                        The first step to collaborating and sharing resources.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-l-4 border-blue-500 rounded-sm mb-3 py-3.5 hover:bg-blue-50 transition-colors duration-100">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Upload notes to share with your class
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Unlock this by joining your first organization.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-l-4 border-blue-500 rounded-sm mb-3 py-3.5 hover:bg-blue-50 transition-colors duration-100">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        See AI-generated summaries and flashcards
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Available once you have content in your organization.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CardContent>
              </Card>
            </CardContent>
          </div>
          <Card className="w-2/4 mr-6">
            <CardContent>
             
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
}
