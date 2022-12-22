import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import AuthPage from "./pages/AuthPage/AuthPage";
import MenuWrapper from "./components/MenuWrapper/MenuWrapper";
import WorkPermitsPage from "./pages/WorkPermitsPage/WorkPermitsPage";
import WorkPermitsInfoPage from "./pages/WorkPermitsInfoPage/WorkPermitsInfoPage";
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import EmployeeListPage from "./pages/EmployeeListPage/EmployeeListPage";
import EmployeeInfoPage from "./pages/EmployeeInfoPage/EmployeeInfoPage";
import DocumentsLayout from "./pages/DocumentsPage/DocumentsLayout";
import TrainingsPage from "./pages/TrainingsPage/TrainingsPage";
import BriefingsPage from "./pages/BriefingsPage/BriefingsPage";
import Feedback from "./pages/Feedback/Feedback";
import Executor from "./pages/BriefingsPage/Executor";
import Creator from "./pages/BriefingsPage/Creator";
import MyBriefing from "./pages/BriefingsPage/MyBriefing";
import EditBriefing from "./pages/BriefingsPage/EditBriefing";
import Quiz from "./pages/BriefingsPage/Quiz";
import BriefingsList from "./pages/BriefingsPage/components/BriefingsList";
import Content from "./pages/BriefingsPage/components/Content";

const App = () => {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>САТМ-Control automated technological methodology</title>
			</Helmet>
			<Router>
				<Routes>
					<Route path="/" element={<ProtectedRoutes />}>
						<Route path="/" element={<MenuWrapper />}>
							<Route path="/" element={<MyProfilePage />} />
							<Route path="work-permits" element={<WorkPermitsPage />} />
							<Route
								path="work-permits/:id"
								element={<WorkPermitsInfoPage />}
							/>
							<Route path="employee" element={<EmployeeListPage />} />
							<Route path="employee/:id" element={<EmployeeInfoPage />} />
							<Route path="briefings" element={<BriefingsPage />}>
								<Route path="executor" element={<Executor />}>
									<Route index element={<BriefingsList />} />
									<Route path=":id" element={<Content />} />
								</Route>
								<Route path="quiz" element={<Quiz />} />
								<Route path="creator" element={<Creator />} />
								<Route path="creator/briefing/:id" element={<MyBriefing />} />
								<Route path="creator/edit/:id" element={<EditBriefing />} />
								<Route path="creator/create" element={<EditBriefing />} />
							</Route>
							<Route path="trainings" element={<TrainingsPage />} />
							<Route path="documents" element={<DocumentsLayout />} />
							<Route path="feedback" element={<Feedback />} />
							<Route path="*" element={<NotFoundPage />} />
						</Route>
					</Route>
					<Route path="/login" element={<AuthPage />} />
				</Routes>
			</Router>
		</>
	);
};

export default App;
